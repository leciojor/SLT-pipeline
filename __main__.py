'''
The main logic for the pipeline is here. You just need to run it with the following format: python __main__.py -i <name-of-input-speech> -o <name-of-output-speech>
'''

import argparse
import os
import azure.cognitiveservices.speech as speechsdk

import requests, uuid, json
from dotenv import load_dotenv
load_dotenv()



def asr(input_audio):
    #getting ASR output

    speech_config = speechsdk.SpeechConfig(subscription=os.environ.get('SPEECH_KEY'), region=os.environ.get('SPEECH_REGION'))
    speech_config.speech_recognition_language="en-US"

    audio_config = speechsdk.audio.AudioConfig(filename=input_audio)  
    speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)

    speech_recognition_result = speech_recognizer.recognize_once_async().get()

    if speech_recognition_result.reason == speechsdk.ResultReason.RecognizedSpeech:
        recognized = speech_recognition_result.text
    elif speech_recognition_result.reason == speechsdk.ResultReason.NoMatch:
        raise Exception("No speech could be recognized: {}".format(speech_recognition_result.no_match_details))
    elif speech_recognition_result.reason == speechsdk.ResultReason.Canceled:
        cancellation_details = speech_recognition_result.cancellation_details
        raise Exception(f"Speech Recognition canceled: {cancellation_details.reason}. Did you set the speech resource key and region values?")


    return recognized

def mt(speech_text):
    #getting MT output

    endpoint = "https://api.cognitive.microsofttranslator.com"
    location = os.environ.get('SPEECH_REGION')
    path = '/translate'
    constructed_url = endpoint + path

    params = {
        'api-version': '3.0',
        'from': 'en',
        'to': ['pt']
    }

    headers = {
        'Ocp-Apim-Subscription-Key': os.environ.get('TRANSLATOR_KEY'),
        'Ocp-Apim-Subscription-Region': location,
        'Content-type': 'application/json',
        'X-ClientTraceId': str(uuid.uuid4())
    }

    body = [{
        'text': speech_text
    }]

    request = requests.post(constructed_url, params=params, headers=headers, json=body)
    response = request.json()

    return response[0]["translations"][0]["text"]


def tts(translated_text, output_file):
    #outputting speech

    speech_config = speechsdk.SpeechConfig(subscription=os.environ.get('SPEECH_KEY'), region=os.environ.get('SPEECH_REGION'))
    audio_config = speechsdk.audio.AudioOutputConfig(filename=output_file)

    speech_config.speech_synthesis_voice_name='en-US-AvaMultilingualNeural'

    speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)


    speech_synthesis_result = speech_synthesizer.speak_text_async(translated_text).get()

    if speech_synthesis_result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
        return speech_synthesis_result
    elif speech_synthesis_result.reason == speechsdk.ResultReason.Canceled:
        cancellation_details = speech_synthesis_result.cancellation_details
        raise Exception(f"Speech synthesis canceled: {cancellation_details.reason}. Did you set the speech resource key and region values?")





if __name__ == "__main__":
    #just logic for running the script - python __main__.py -i <name-of-input-speech> -o <name-of-output-speech>

    parser = argparse.ArgumentParser(description="SLT-pipeline processing")
    parser.add_argument("-i", "--input", help="Input speech file name")
    parser.add_argument("-o", "--output", help="Output speech file name")
    args = parser.parse_args()

    if args.input and args.output:
        input = args.input
        output = args.output

        text_src = asr(input)
        translated_text = mt(text_src)
        tts(translated_text, output)


    else:
        raise Exception("No input with output selection")

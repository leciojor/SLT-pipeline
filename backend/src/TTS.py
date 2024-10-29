import argparse
import os
import azure.cognitiveservices.speech as speechsdk

from dotenv import load_dotenv
load_dotenv()


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




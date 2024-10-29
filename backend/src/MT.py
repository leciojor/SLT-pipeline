import argparse
import os
import azure.cognitiveservices.speech as speechsdk

import requests, uuid
from dotenv import load_dotenv
load_dotenv()



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



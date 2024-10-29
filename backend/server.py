from flask import Flask, request, jsonify
from src.MT import mt
from src.TTS import tts
from flask_cors import CORS
import base64

app = Flask(__name__)
CORS(app)

@app.route('/translate', methods=['post'])
def run_method():
    
    data = request.json  
    src_text = data.get('src_text')
    try:
        print("translating")
        translated_text = mt(src_text)
        speech_translated = tts(translated_text, "outpu")

        audio_base64 = base64.b64encode(speech_translated.audio_data).decode('utf-8')
        
        if src_text:
            return jsonify({"message": "Text received, translated successfully, and converted to speech successfully", "translated_speech": audio_base64}), 200
        else:
            return jsonify({"message": "No text was sent to the server"}), 400
    

    except Exception as e:
        return jsonify({"error": f"{e}", "details": str(e)}), 500



if __name__ == '__main__':
    app.run(port=5000)


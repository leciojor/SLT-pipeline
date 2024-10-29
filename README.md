# SLT-pipeline

THIS PROJECT IS BEING HOSTED AT: ** http://ec2-18-188-234-57.us-east-2.compute.amazonaws.com **
*make sure to use the http protocol because I did not have time to set up the certificates

However, in case you would like to test it manually, do the following: 

* Clone the repository 

* Install the dependencies on backend/requirements.txt

* Add your input speech file (wav please) to the ROOT folder 

* add a .env file to the root with the following env variables:

SPEECH_KEY = <your-azure-api-key-for-ASR> 

SPEECH_REGION = <your-azure-speech-region>

TRANSLATOR_KEY =  <your-azure-translator-api-key>

*Run __main__.py with the following format:

    python __main__.py -i <name-of-input-speech> -o <name-of-output-speech>

**Make sure to put the right path for the files, otherwise the program will not locate it

**For running the logic manually, please fill both the input and output parameters. If both are not included, the application will raise an error. Also, if the file is invalid, it will also throw an error. If you would like to check the application in a more intuitive way, you can simply check it at the server that it is hosted: ** http://ec2-18-188-234-57.us-east-2.compute.amazonaws.com **

**If the audio file is invalid, it will also throw an error

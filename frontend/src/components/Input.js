import React, { useState, useEffect } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const Input = () => {
  const [gettingSpeech, setGettingSpeech] = useState(false);
  const [error, setError] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [givingSpeech, setGivingSpeech] = useState(false);
  const [translatedSpeech, setTranslatedSpeech] = useState("");
  const [srcText, setSrcText] = useState("");

  const resetState = () => {
    setGettingSpeech(false);
    setError("");
    setIsTranslating(false);
    setGivingSpeech(false);
    setTranslatedSpeech("");
    setSrcText("");
  };

  //input audio logic
  async function getAudio() {
    console.log("Getting audio")
    try {
      const subscriptionKey = process.env.REACT_APP_SPEECH_KEY;
      console.log(subscriptionKey)
      const region = process.env.REACT_APP_SPEECH_REGION;
      const speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, region);
      const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
      // Create the speech recognizer
      const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

      console.log("STARTING RECOGNITION");

      // Start recognizing speech once
      recognizer.recognizeOnceAsync((result) => {
        // Check the result
        if (result.reason === sdk.ResultReason.RecognizedSpeech) {
          console.log(`Recognized: ${result.text}`);
          setSrcText(result.text);
          setGettingSpeech(false);
          setIsTranslating(true);
        } else if (result.reason === sdk.ResultReason.NoMatch) {
          console.log("No speech could be recognized.");
          setError("No speech could be recognized.");
        } else if (result.reason === sdk.ResultReason.Canceled) {
          const cancellation = sdk.CancellationDetails.fromResult(result);
          console.log(`Canceled: ${cancellation.reason}`);
          setError(`Canceled: ${cancellation.reason}`);
          if (cancellation.reason === sdk.CancellationReason.Error) {
            console.log(`Error details: ${cancellation.errorDetails}`);
            setError(`Error details: ${cancellation.errorDetails}`);
          }
        }
        setGettingSpeech(false);
        recognizer.close();
      });
    } catch (error) {
      // Handle network errors or other unforeseen errors
      console.error("Fetch error:", error);
      alert(`Cannot connect to server: ${error}`);
      setError(error.message || "An unknown error occurred");
      setGettingSpeech(false);
    }
  }

  //Send to flask server
  async function sendText(speech_text) {
    console.log("Sending request");
    try {
      const response = await fetch("http://localhost:5000/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ src_text: speech_text }),
      });
      if (!response.ok) {
        // Handle non-200 HTTP responses
        var errorData = await response.json();
        setError(errorData.error || "An unknown error occurred");
        console.error("Error during request:", errorData.error);
      } else {
        const data = await response.json();
        const translatedSpeech = data.translated_speech;
        setTranslatedSpeech(translatedSpeech);
        setGivingSpeech(true);
      }
      setIsTranslating(false);
    } catch (error) {
      // Handle network errors or other unforeseen errors
      console.error("Fetch error:", error);
      alert(`Cannot connect to server: ${error}`);
      setIsTranslating(false);
      setError(error.message || "An unknown error occurred");
    }
  }

  //output audio to local audio

  async function outputTranslatedAudio() {
    try {
      const audioData = translatedSpeech;

      const binaryString = atob(audioData);
      const binaryLength = binaryString.length;
      const bytes = new Uint8Array(binaryLength);

      // Convert the binary string to a Uint8Array
      for (let i = 0; i < binaryLength; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Create a Blob from the binary data (decoded base64)
      const audioBlob = new Blob([bytes], { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      // Play the audio
      audio
        .play()
        .then(() => {
          console.log("Playing synthesized audio...");
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
          setError(`Error playing audio: ${error}`);
        });
    } catch (error) {
      // Handle network errors or other unforeseen errors
      console.error("Fetch error:", error);
      alert(`Cannot connect to server: ${error}`);
      setError(error.message || "An unknown error occurred");
      setGivingSpeech(false);
    }
  }

  useEffect(() => {
    if (gettingSpeech) {
      getAudio();
    } else if (isTranslating) {
      sendText(srcText);
    } else if (givingSpeech) {
      outputTranslatedAudio();
    }
  }, [gettingSpeech, isTranslating, givingSpeech]);

  return (
    <>
      {!gettingSpeech && !isTranslating && !givingSpeech && (
        <Box
          sx={{
            backgroundColor: "blue",
            color: "white",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h2" sx={{ marginBottom: 2 }}>
            SPEECH TRANSLATION let's go!!!
          </Typography>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            Press button and say whatever you wanna translate... *Currently only available from
            english to portuguese
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ padding: 2 }}
            onClick={() => setGettingSpeech(true)}
          >
            Start Translation
          </Button>
          {error && (
            <Typography variant="body1" sx={{ color: "red", marginTop: 2, fontWeight: "520" }}>
              The following error happened. Try again: {error}
            </Typography>
          )}
        </Box>
      )}
      {gettingSpeech && !isTranslating && !givingSpeech && (
        <Box
          sx={{
            backgroundColor: "blue",
            color: "white",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FiberManualRecordIcon sx={{ color: "red", marginRight: "8px" }} />
          <Typography variant="h6">Recording...</Typography>
          <Typography variant="h7">Press ENTER to stop recording or just stop speaking</Typography>
        </Box>
      )}
      {!gettingSpeech && isTranslating && !givingSpeech && (
        <Box
          sx={{
            backgroundColor: "blue",
            color: "white",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            Translating audio to Portuguese
          </Typography>
          <CircularProgress />
        </Box>
      )}
      {!gettingSpeech && !isTranslating && givingSpeech && (
        <Box
          sx={{
            backgroundColor: "blue",
            color: "white",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{ padding: 2 }}
            onClick={() => outputTranslatedAudio()}
          >
            Hear Translation
          </Button>
          <Button
            variant="outlined" // Changed to outlined for a different style
            sx={{
              padding: 2,
              marginTop: 2,
              color: "red",
              borderColor: "red",
              "&:hover": { backgroundColor: "rgba(255, 0, 0, 0.1)" },
            }}
            onClick={() => resetState()}
          >
            <Typography variant="button" sx={{ fontWeight: "bold" }}>
              Reset
            </Typography>
          </Button>
        </Box>
      )}
    </>
  );
};

export default Input;

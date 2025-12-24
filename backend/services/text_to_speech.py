import os
import base64

def synthesize_text(text):
    creds_env = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    
    # Robust path resolution
    if creds_env:
        # 1. Try absolute or direct relative path
        if os.path.exists(creds_env):
            creds = creds_env
        # 2. Try handling "backend/" prefix issue if running inside backend
        elif creds_env.startswith("backend/") and os.path.exists(creds_env.replace("backend/", "")):
            creds = creds_env.replace("backend/", "")
            # Update env for the library to find it
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = creds
        else:
            creds = None
    else: 
        creds = None

    if not creds:
        print(f"TTS Error: Credentials not found at {creds_env}")
        return None # Controller will handle None as "use frontend TTS"

    try:
        from google.cloud import texttospeech
        import re

        # Clean text: Remove markdown characters * # : ;
        clean_text = re.sub(r'[\*#_:;]', '', text)
        
        client = texttospeech.TextToSpeechClient()
        synthesis_input = texttospeech.SynthesisInput(text=clean_text)

        voice = texttospeech.VoiceSelectionParams(
            language_code="en-US",
            ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
        )

        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3
        )

        response = client.synthesize_speech(
            input=synthesis_input, voice=voice, audio_config=audio_config
        )

        return response.audio_content
    except Exception as e:
        print(f"TTS Error: {e}")
        return None

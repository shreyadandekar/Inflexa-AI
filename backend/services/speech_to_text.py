import os

def transcribe_audio_file(file_path):
    """
    Transcribes audio/video files. 
    Now uses Gemini as the primary engine because it handles files > 10MB 
    and durations > 60s much better than standard synchronous STT.
    """
    try:
        # 1. Attempt Gemini transcription
        try:
            from services.gemini_service import transcribe_media
            print(f"DEBUG: Attempting Gemini transcription for: {file_path}")
            transcript = transcribe_media(file_path)
            
            if transcript and not (isinstance(transcript, str) and transcript.startswith("Error")):
                print("DEBUG: Gemini transcription successful!")
                return transcript
        except Exception as ge:
            print(f"Gemini service call failed: {ge}")

        # 2. Fallback to a descriptive Mock if everything fails
        # This occurs if Gemini is not configured or fails.
        msg = "[MOCK] Transcribed text from audio file... (The student is explaining how apps work so fast by using caching and CDNs)"
        return msg

    except Exception as e:
        print(f"STT Error: {e}")
        return "[MOCK] Transcribed text (Main exception fallback)..."

import os
from flask import Blueprint, request, jsonify
from services.speech_to_text import transcribe_audio_file
from utils.validators import validate_video_audio
from werkzeug.utils import secure_filename
import tempfile

audio_bp = Blueprint('audio', __name__)

@audio_bp.route('/transcribe', methods=['POST'])
def transcribe():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    valid, msg = validate_video_audio(file)
    if not valid:
        return jsonify({'error': msg}), 400

    # Save temp file
    filename = secure_filename(file.filename)
    # create a temp dir manually for more control on Windows
    tmpdirname = tempfile.mkdtemp()
    filepath = os.path.join(tmpdirname, filename)
    
    try:
        file.save(filepath)
        file.close() # Explicitly close the request file object
        
        # Transcribe
        transcript = transcribe_audio_file(filepath)
    finally:
        # On Windows, libraries like genai or moviepy might briefly hold a handle.
        # ignore_errors=True prevents the server from crashing if cleanup fails.
        import shutil
        import time
        
        # Small delay to allow OS to release handles
        time.sleep(1) 
        shutil.rmtree(tmpdirname, ignore_errors=True)
        
    return jsonify({'transcript': transcript})


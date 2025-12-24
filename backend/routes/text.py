from flask import Blueprint, request, jsonify
from services.gemini_service import generate_content
from services.text_to_speech import synthesize_text
from utils.validators import validate_text_length
import base64

text_bp = Blueprint('text', __name__)

@text_bp.route('/simplify', methods=['POST'])
def simplify():
    data = request.json
    text = data.get('text', '')
    
    valid, msg = validate_text_length(text)
    if not valid:
        return jsonify({'error': msg}), 400

    result = generate_content('simplify', text)
    return jsonify({'result': result})

@text_bp.route('/isl-gloss', methods=['POST'])
def isl_gloss():
    data = request.json
    text = data.get('text', '')
    
    valid, msg = validate_text_length(text)
    if not valid:
        return jsonify({'error': msg}), 400

    result = generate_content('isl', text)
    return jsonify({'result': result})

@text_bp.route('/adhd-summary', methods=['POST'])
def adhd_summary():
    data = request.json
    text = data.get('text', '')
    
    valid, msg = validate_text_length(text)
    if not valid:
        return jsonify({'error': msg}), 400
        
    result = generate_content('adhd', text)
    return jsonify({'result': result})

@text_bp.route('/cognitive-explain', methods=['POST'])
def cognitive_explain():
    data = request.json
    text = data.get('text', '')
    
    valid, msg = validate_text_length(text)
    if not valid:
        return jsonify({'error': msg}), 400
        
    result = generate_content('cognitive', text)
    return jsonify({'result': result})

@text_bp.route('/text-to-speech', methods=['POST'])
def text_to_speech():
    data = request.json
    text = data.get('text', '')
    
    valid, msg = validate_text_length(text)
    if not valid:
        return jsonify({'error': msg}), 400

    audio_content = synthesize_text(text)
    
    if audio_content:
        # Return base64 encoded audio
        audio_b64 = base64.b64encode(audio_content).decode('utf-8')
        return jsonify({'audio_content': audio_b64, 'format': 'mp3'})
    else:
        # Fallback to frontend TTS indicator
        return jsonify({'error': 'TTS Service unavailable', 'use_frontend': True}), 503

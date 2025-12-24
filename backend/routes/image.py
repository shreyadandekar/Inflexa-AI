import os
from flask import Blueprint, request, jsonify
from services.gemini_service import explain_image
from services.vision_service import analyze_image_text
from utils.validators import validate_image
from werkzeug.utils import secure_filename
import tempfile

image_bp = Blueprint('image', __name__)

@image_bp.route('/diagram-explain', methods=['POST'])
def diagram_explain():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
        
    file = request.files['file']
    valid, msg = validate_image(file)
    if not valid:
        return jsonify({'error': msg}), 400

    filename = secure_filename(file.filename)
    with tempfile.TemporaryDirectory() as tmpdirname:
        filepath = os.path.join(tmpdirname, filename)
        file.save(filepath)
        
        # Multimodal explanation
        # Multimodal explanation using Gemini
        explanation = explain_image(filepath)
        
        # NOTE: If gemini_service (explain_image) fails to find a key, it returns MOCK text.
        # It should NOT return vision_service JSON unless specifically coded to do so in gemini_service.py (which it isn't).
        # The JSON output likely came from vision_service.analyze_image_text being called somewhere else 
        # or if explain_image was swapped. With this explicit call, it should work.
        
    return jsonify({'explanation': explanation})

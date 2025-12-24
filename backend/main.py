import os
from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__, static_folder='../frontend', static_url_path='/')
    CORS(app)
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload

    # Register blueprints
    from routes.audio import audio_bp
    from routes.image import image_bp
    from routes.text import text_bp
    app.register_blueprint(audio_bp, url_prefix='/api/audio')
    app.register_blueprint(image_bp, url_prefix='/api/image')
    app.register_blueprint(text_bp, url_prefix='/api/text')

    @app.route('/')
    def serve_index():
        return send_from_directory(app.static_folder, 'index.html')

    @app.errorhandler(Exception)
    def handle_exception(e):
        # pass through HTTP errors
        if hasattr(e, 'code'):
            return jsonify(error=str(e)), e.code
        # now you're handling non-HTTP exceptions only
        return jsonify(error=str(e)), 500

    @app.errorhandler(404)
    def not_found(e):
        return jsonify(error="Resource not found"), 404

    @app.errorhandler(405)
    def method_not_allowed(e):
        return jsonify(error="Method not allowed"), 405
        
    @app.errorhandler(413)
    def request_too_large(e):
        return jsonify(error="File too large"), 413

    @app.route('/<path:path>')
    def serve_static(path):
        if path.startswith('api/'):
            return jsonify(error=f"API endpoint '{path}' not found"), 404
            
        if os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        return send_from_directory(app.static_folder, 'index.html')

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)

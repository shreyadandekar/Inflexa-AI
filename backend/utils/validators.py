ALLOWED_VIDEO_EXTENSIONS = {'mp4', 'mp3', 'wav'}
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename, allowed_extensions):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions

def validate_video_audio(file):
    if not file:
        return False, "No file provided. Please upload a valid video or audio file."
    
    if not allowed_file(file.filename, ALLOWED_VIDEO_EXTENSIONS):
        return False, "Invalid file type. We support MP4, MP3, and WAV."

    # Size check: 15MB
    # 15 * 1024 * 1024 bytes
    limit_mb = 15
    limit_bytes = limit_mb * 1024 * 1024
    
    file.seek(0, 2)
    size = file.tell()
    file.seek(0)
    
    if size > limit_bytes:
         return False, f"File is too large ({size/1024/1024:.1f}MB). The limit is {limit_mb}MB."
    
    return True, "Valid"

def validate_image(file):
    if not file:
        return False, "No file provided. Please upload an image."
    
    if not allowed_file(file.filename, ALLOWED_IMAGE_EXTENSIONS):
        return False, "Invalid image type. We support PNG and JPG."
        
    # Size check: 5MB
    limit_mb = 5
    limit_bytes = limit_mb * 1024 * 1024
    
    file.seek(0, 2)
    size = file.tell()
    file.seek(0)
    
    if size > limit_bytes:
         return False, f"Image is too large ({size/1024/1024:.1f}MB). The limit is {limit_mb}MB."
         
    return True, "Valid"

def validate_text_length(text, max_len=15000):
    if not text or not text.strip():
        return False, "Please enter some text to process."
        
    if len(text) > max_len:
        return False, f"Text is too long ({len(text)} chars). Please keep it under {max_len} characters."
        
    return True, "Valid"

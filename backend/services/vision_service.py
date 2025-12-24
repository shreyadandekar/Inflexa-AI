import os

def analyze_image_text(image_path):
    creds_env = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    
    # Robust path resolution
    if creds_env:
        if os.path.exists(creds_env):
            creds = creds_env
        elif creds_env.startswith("backend/") and os.path.exists(creds_env.replace("backend/", "")):
            creds = creds_env.replace("backend/", "")
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = creds
        else:
            creds = None
    else: creds = None

    if not creds:
        return "[MOCK] Detected Text: Diagram Labels (X-Axis, Y-Axis, Growth Trend)"

    try:
        from google.cloud import vision
        client = vision.ImageAnnotatorClient()

        with open(image_path, "rb") as image_file:
            content = image_file.read()

        image = vision.Image(content=content)
        response = client.text_detection(image=image)
        texts = response.text_annotations

        if texts:
            return texts[0].description
        return "No text detected."
    except Exception as e:
        print(f"Vision Error: {e}")
        return "[MOCK] Vision API Error Fallback"

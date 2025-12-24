import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def load_prompt(filename):
    try:
        # Use absolute path relative to this file
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        prompts_dir = os.path.join(base_dir, "prompts")
        file_path = os.path.join(prompts_dir, filename)
        
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        print(f"Error loading prompt {filename}: {e}")
        return ""

def generate_content(prompt_type, input_text):
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_gemini_api_key":
        return f"[MOCK] Generated {prompt_type} result for: {input_text[:50]}..."
    
    model = genai.GenerativeModel('gemini-2.0-flash')
    
    prompt_file_map = {
        "simplify": "simplify_prompt.txt",
        "isl": "isl_gloss_prompt.txt",
        "adhd": "adhd_highlight_prompt.txt",
        "cognitive": "cognitive_prompt.txt"
    }
    
    base_prompt = load_prompt(prompt_file_map.get(prompt_type, ""))
    if not base_prompt:
        return "Error: Prompt not found."

    full_prompt = f"{base_prompt}\n{input_text}"
    
    try:
        response = model.generate_content(full_prompt)
        return response.text
    except Exception as e:
        return f"Error generating content: {str(e)}"

def explain_image(image_path):
    if not GEMINI_API_KEY or GEMINI_API_KEY == "GEMINI_API_KEY":
        return "[MOCK] Detailed diagram explanation (relationships, trends, components)..."
        
    model = genai.GenerativeModel('gemini-2.0-flash')
    base_prompt = load_prompt("diagram_explain_prompt.txt")
    
    try:
        # Uploading file to Gemini (or passing bytes if supported directly, often need PIL)
        # For simplicity in this script, assuming we handle image loading.
        # But genai supports PIL images.
        import PIL.Image
        img = PIL.Image.open(image_path)
        try:
            response = model.generate_content([base_prompt, img])
            return response.text
        finally:
            img.close()
    except Exception as e:
        return f"Error explaining image: {str(e)}"

def transcribe_media(file_path):
    if not GEMINI_API_KEY or GEMINI_API_KEY == "GEMINI_API_KEY":
        return "[MOCK] Audio/Video transcript (Gemini fallback)..."

    # Use gemini-2.0-flash which is available in this environment
    model = genai.GenerativeModel('models/gemini-2.0-flash')
    
    try:
        # Upload the file to Gemini's File API
        print(f"DEBUG: Uploading {file_path} to Gemini...")
        uploaded_file = genai.upload_file(path=file_path)
        print(f"DEBUG: Uploaded file {uploaded_file.name}, waiting for processing...")

        # Polling for processing status (Required for videos)
        import time
        while uploaded_file.state.name == "PROCESSING":
            print(".", end="", flush=True)
            time.sleep(2)
            uploaded_file = genai.get_file(uploaded_file.name)

        if uploaded_file.state.name == "FAILED":
            raise Exception("File processing failed on Gemini side.")

        print(f"\nDEBUG: File state: {uploaded_file.state.name}. Generating timestamped transcript...")
        
        # Expert ISL Gloss instructions integrated into the main transcription prompt
        isl_rules = """
        ISL Gloss Rules:
        1. Remove all articles (a, an, the)
        2. Use base verb forms only (no -ing, -ed, -s endings)
        3. Place time markers at the beginning
        4. Use topic-comment structure (topic first, then comment)
        5. Remove prepositions where context is clear
        6. Keep only essential content words
        7. Use ALL CAPS for each gloss word
        8. Separate words with spaces
        """

        # Define strict JSON schema for guaranteed formatting
        response_schema = {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "start": {"type": "number"},
                    "end": {"type": "number"},
                    "text": {"type": "string"},
                    "isl": {"type": "string"}
                },
                "required": ["start", "end", "text", "isl"]
            }
        }

        prompt = f"""
        Please provide a complete and accurate transcription of the speech in this media file, split into segments of approximately 20-30 seconds each.
        
        For EACH segment, also provide an Indian Sign Language (ISL) Gloss translation following these rules:
        {isl_rules}
        
        Output must strictly follow the provided JSON schema.
        """
        
        # Use JSON mode with schema for guaranteed structured output
        generation_config = {
            "response_mime_type": "application/json",
            "response_schema": response_schema
        }
        
        response = model.generate_content([prompt, uploaded_file], generation_config=generation_config)
        
        # In JSON mode with schema, the response is guaranteed to be valid JSON.
        json_text = response.text.strip()
        print(f"DEBUG: Successfully generated structured transcription data.")
        return json_text

    except Exception as e:
        print(f"Gemini Transcription Error: {e}")
        return f"Error transcribing media: {str(e)}"

    finally:
        # Cleanup Gemini Storage
        try:
            if 'uploaded_file' in locals():
                genai.delete_file(uploaded_file.name)
                print(f"DEBUG: Cleaned up Gemini storage for {uploaded_file.name}")
        except: pass



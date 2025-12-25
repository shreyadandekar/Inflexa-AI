# Inflexa - AI-Powered Accessibility Platform 🚀

Inflexa is a robust, AI-driven accessibility platform designed to make educational content inclusive for diverse learners, including those with hearing/visual impairments, dyslexia, and ADHD.

## ✨ Core Features

- **🎬 Video Accessibility**:
  - **Perfectly Synced Captions**: Real-time English captions with sub-second accuracy.
  - **Expert ISL Gloss**: Indian Sign Language (ISL) Gloss captions following professional linguistic rules (TOPIC-COMMENT structure).
  - **Full-Screen Support**: Interactive captions that remain visible and scale appropriately in full-screen mode.
  - **Optimized Caption Sizing**: Subtle, readable captions (0.75rem normal, 1.2rem fullscreen) that don't overpower the video.
- **🔊 Multi-Service Transcription**: Powered by Google Gemini 2.0 Flash to handle large media files (up to hours long).
- **👁️ Visual Analysis**: Detailed explanation of diagrams and images using Gemini Vision.
- **📖 Cognitive Support**: Simplified text for dyslexia and structured highlights for ADHD learners.
- **🎙️ Audio Narration**: High-quality Text-to-Speech (TTS) using Google Cloud TTS.

## 🎨 Recent Updates

- **Enhanced Video UI**: Centered video layout with max-width of 900px for optimal viewing experience
- **Improved Caption Sizing**: Reduced caption font size for better readability without overwhelming the video
- **Responsive Layout**: Smart layout detection that adapts based on content type (single-column for video-only, split-layout for mixed content)
- **Better Spacing**: Improved padding and margins throughout the interface for a cleaner, more professional appearance

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3 (Modern glassmorphism design).
- **Backend**: Flask (Python), Gemini 2.0 Flash (Generative AI), Google Cloud Vision, Google Cloud TTS.
- **Media Processing**: MoviePy for robust audio/video handling.

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/shreyadandekar/Inflexa-AI.git
   cd Inflexa-AI
   ```

2. **Setup Backend**:
   - Navigate to `backend/`
   - Create a virtual environment: `python -m venv venv`
   - Activate it: `source venv/bin/activate` (Mac/Linux) or `venv\Scripts\activate` (Windows)
   - Install dependencies: `pip install -r requirements.txt`

3. **Environment Variables**:
   - Copy `.env.example` to `.env`
   - Add your `GEMINI_API_KEY`
   - Place your Google Cloud `credentials.json` in the `backend/` folder.

4. **Run the Server**:
   ```bash
   cd backend
   python main.py
   ```
   The backend will serve the frontend at `http://127.0.0.1:5000/`.

## 📜 Repository Structure

- `/frontend`: Responsive UI and core logic (`main.js`, `style.css`).
- `/backend`: Flask server, AI services, and custom prompts.
- `/backend/prompts`: Expert-tuned linguistic prompts for ISL and stabilization.

## 🌟 Key Features in Detail

### Video Processing
- Handles large video files with Gemini 2.0 Flash's extended context window
- JSON-based timestamped transcription for perfect caption synchronization
- Dual caption modes: English transcription and ISL Gloss translation

### Accessibility Options
- **Hearing Impaired**: Real-time captions and ISL Gloss
- **Visually Impaired**: Audio descriptions and text-to-speech narration
- **Dyslexia**: Simplified, easy-to-read text formatting
- **ADHD**: Key highlights and summarized content
- **Cognitive Disabilities**: Step-by-step explanations

---

*Built for inclusive education and accessibility. Mumbai ML Hackathon Project.*

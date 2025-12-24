# Inflexa - AI-Powered Accessibility Platform 🚀

Inflexa is a robust, AI-driven accessibility platform designed to make educational content inclusive for diverse learners, including those with hearing/visual impairments, dyslexia, and ADHD.

## ✨ Core Features

- **🎬 Video Accessibility**:
  - **Perfectly Synced Captions**: Real-time English captions with sub-second accuracy.
  - **Expert ISL Gloss**: Indian Sign Language (ISL) Gloss captions following professional linguistic rules (TOPIC-COMMENT structure).
  - **Full-Screen Support**: Interactive captions that remain visible and scale in full-screen mode.
- **🔊 Multi-Service Transcription**: Powered by Google Gemini 1.5 Pro to handle large media files (up to hours long).
- **👁️ Visual Analysis**: Detailed explanation of diagrams and images using Gemini Vision.
- **📖 Cognitive Support**: Simplified text for dyslexia and structured highlights for ADHD learners.
- **🎙️ Audio Narration**: High-quality Text-to-Speech (TTS) using Google Cloud TTS.

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3 (Glassmorphism design).
- **Backend**: Flask (Python), Gemini 1.5 Pro (Generative AI), Google Cloud Vision, Google Cloud TTS.
- **Media Processing**: MoviePy for robust audio/video handling.

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone [your-repo-url]
   cd Inflexa-3
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
   python main.py
   ```
   The backend will serve the frontend at `http://127.0.0.1:5000/index.html`.

## 📜 Repository Structure

- `/frontend`: Responsive UI and core logic (`main.js`).
- `/backend`: Flask server, AI services, and custom prompts.
- `/backend/prompts`: Expert-tuned linguistic prompts for ISL and stabilization.

---
*Built for inclusive education and accessibility.*

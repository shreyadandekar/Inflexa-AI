# Inflexa - AI-Powered Accessibility Platform 🚀

## Project Overview
Inflexa is a robust, AI-driven accessibility platform designed to make educational content inclusive for diverse learners, including those with hearing/visual impairments, dyslexia, and ADHD. It leverages Google Gemini 2.0 Flash to handle large media files and generate perfectly synced captions, Indian Sign Language (ISL) Gloss, visual analysis, and cognitive support.

## Core Features
### Video Accessibility
- Perfectly synced captions and expert ISL Gloss.
- Optimized sizing for accessibility in normal and fullscreen modes.
### Visual & Cognitive Support
- Detailed diagram/image analysis using Gemini Vision.
- Simplified text for dyslexia and structured highlights for ADHD.
### Audio Narration
- High-quality Text-to-Speech (TTS) for educational content.

## 🚀 How to Run

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
   - Copy `.env.example` to `.env` (Rename it to `.env`)
   - Add your `GEMINI_API_KEY`
   - Place your Google Cloud `credentials.json` in the `backend/` folder.

4. **Run the Server**:
   ```bash
   cd backend
   python main.py
   ```
   The application will be accessible at `http://127.0.0.1:5000/`.

---
*Built for the Mumbai ML Hackathon - Focus on Inclusive Education.*

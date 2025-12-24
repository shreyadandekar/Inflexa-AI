# Inflexa Backend Setup Guide

This guide explains how to configure the backend to use real Google Cloud services instead of mock data.

## 1. Google Cloud Project Setup

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project or select an existing one.
3.  **Enable the following APIs** in "APIs & Services" > "Library":
    *   **Cloud Speech-to-Text API**
    *   **Cloud Text-to-Speech API**
    *   **Cloud Vision API**

## 2. Text Service (Gemini)

1.  Go to [Google AI Studio](https://aistudio.google.com/).
2.  Get an API Key.
3.  Open `backend/.env` and paste it:
    ```env
    GEMINI_API_KEY=your_actual_api_key_here
    ```
    *(Note: We have already set this up for you if you provided the key earlier!)*

## 3. Audio & Image Services (Google Cloud Credentials)

These services require a **Service Account Key** (JSON file), not just a simple text string.

1.  In Google Cloud Console, go to **IAM & Admin** > **Service Accounts**.
2.  Click **Create Service Account**.
    *   Name: `inflexa-backend`
    *   Grant this service account the **Owner** role (or specifically specific roles for Speech, Vision, and TTS).
3.  Click on the newly created service account email.
4.  Go to the **Keys** tab.
5.  Click **Add Key** > **Create new key** > **JSON**.
6.  A file will verify download to your computer. **Rename it to `credentials.json`**.
7.  Move this file into the `backend/` folder of this project.
    *   Path should be: `backend/credentials.json`
8.  Ensure your `backend/.env` file has this line (we set this up already):
    ```env
    GOOGLE_APPLICATION_CREDENTIALS=backend/credentials.json
    ```

## 4. Verification

1.  Restart the backend server if it's running.
2.  The application will automatically detect the credentials and switch from MOCK mode to REAL mode.

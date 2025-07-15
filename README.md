# Mini AI Chat App

A simple desktop GUI chat application powered by Google Gemini via LangChain.  
Send messages and receive AI-generated responses in a user-friendly interface.

## Screenshot
<img width="1917" height="1002" alt="image" src="https://github.com/user-attachments/assets/bf2a7ae1-b5e7-49cd-ab19-f45989725e95" />



## Features

- Chat with Gemini AI (Google Generative Language)
- Markdown-formatted responses
- Easy-to-use GUI (PyWebView)
- Keeps chat history

## Setup

1. **Clone (or fork) the repository**  
   ```
   git clone https://github.com/dynstat/mini-AI-chat-app.git
   cd mini-AI-chat-app
   ```

2. **Install dependencies**  
   ```
   1. Activate the venv using: uv venv
   2. run: uv sync
   ```
   Or use your preferred Python environment manager.

3. **Configure API keys**  
   - Create a `.env` file in the project root.
   - Add your Gemini API key:
     ```
     GEMINI_API_KEY=your-google-gemini-api-key
     ```

## Usage

Run the GUI app:
```
uv run gui-app.py
```

## File Structure

- `gui-app.py` — Main GUI application
- `chat_ai.py` — AI response logic
- `index.html` — Frontend (HTML UI)
- `.env` — Environment variables (API keys)

## Requirements

- Python 3.12+
- See `requirements.txt` or `uv.lock` for dependencies


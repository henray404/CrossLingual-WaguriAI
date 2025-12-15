# Waguri AI
Cross-lingual chatbot web application (Indonesian and English) powered by Qwen2.5-0.5B with Mixture of LoRA Experts (X-LoRA).

Waguri AI is a bilingual chatbot web app built as a demonstration of fine-tuning **Qwen2.5-0.5B** using **Mixture of LoRA Experts (X-LoRA)** for the English–Indonesian pair.

The application consists of:
- **Frontend**: Next.js (App Router) + TypeScript + Tailwind CSS.
- **Backend**: FastAPI (Python) that loads the model `lumicero/Qwen2.5-bilingual-xlora` from Hugging Face and serves local inference.

---

## Features

- Bilingual chatbot that can answer in Indonesian and English.
- Custom X-LoRA model: `lumicero/Qwen2.5-bilingual-xlora` (Qwen2.5-0.5B + Mixture of LoRA Experts).
- Advanced UI controls:
  - Custom **system prompt** so users can control Waguri AI's persona and behavior.
  - Decoding parameters:
    - `temperature`
    - `top_p`
    - `max_tokens`
    - `do_sample` (sampling on/off)
- Clean separation of concerns:
  - Python backend in the `backend/` folder.
  - Next.js frontend in the project root (`app/`, `components/`, etc.).
- Themed UI:
  - Main colors: white and light pink.
  - Header with the name “Waguri AI” and a placeholder avatar for a custom AI icon.
  - Landing-style chat page with welcome hero, language toggle (ID / EN) and central chat card.

---

## Architecture Overview

```text
[Browser]  <---- HTTP (JSON) ---->  [FastAPI Backend]

Frontend:
- Next.js (App Router)
- TypeScript + Tailwind
- Main routes: / (Chat), /about

Backend:
- FastAPI (Python)
- Model: lumicero/Qwen2.5-bilingual-xlora
- Main endpoint:
    POST /api/chat   -> receives messages + config, returns model reply
```

On each request, the backend:

1. Loads the base Qwen2.5-0.5B model and X-LoRA adapters from Hugging Face (on startup).
2. Activates all numeric LoRA adapters to form the Mixture of LoRA Experts.
3. Applies `tokenizer.apply_chat_template` to the conversation history (`messages`).
4. Calls `model.generate(...)` with parameters coming from the frontend.
5. Returns the generated text in a response format similar to OpenAI's ChatCompletion API.

---

## Requirements

### General

- Git
- Internet connection

### Backend (Python)

- Python 3.10 or newer
- Virtual environment (recommended, for example `.venv`)
- Library in requirements.txt file

### Frontend (Node.js)

- Node.js LTS (for example v20)
- `pnpm`

---

## Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/luminolous/CrossLingual-WaguriAI.git
cd CrossLingual-WaguriAI
```

---

### 2. Backend setup (FastAPI + X-LoRA)

Create and activate a virtual environment, then install dependencies.

```bash
python -m venv .venv
.\.venv\Scripts\ctivate

# On Linux / macOS:
# source .venv/bin/activate

# Go to backend folder
cd backend

# Install dependencies from requirements.txt
pip install -r requirements.txt
```

#### Backend structure

The main backend file is `backend/app.py`, which defines a FastAPI application `app` with two main routes:

- `GET /health` – to check the backend status.
- `POST /api/chat` – to perform inference.

The `/api/chat` endpoint expects a request body like:

```json
{
  "messages": [
    { "role": "user", "content": "Hello, Waguri AI!" }
  ],
  "config": {
    "system_prompt": "You are Waguri AI, ... (optional)",
    "temperature": 0.7,
    "top_p": 0.9,
    "max_tokens": 256,
    "do_sample": true
  }
}
```

The backend will:

- Use a default bilingual system prompt if `system_prompt` is empty or `null`.
- Inject that system prompt as the first message (`role: "system"`).
- Use `tokenizer.apply_chat_template` and `model.generate(...)` to generate a response.

#### Running the backend

From inside the `backend` folder (with the virtual environment active):

```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

If the server starts correctly, the backend will be available at:

- http://localhost:8000

Quick health check:

```bash
curl http://localhost:8000/health
# or open the URL above in a browser
```

---

### 3. Frontend setup

In a separate terminal (does not need the Python virtual environment), from the project root:

```bash
cd /path/to/CrossLingual-WaguriAI

# Install frontend dependencies
pnpm install

# Run the development server
pnpm dev
```

If successful, the frontend will be available at:

- http://localhost:3000

The frontend:

- Renders the Waguri AI UI (header, welcome hero, language toggle, central chat card).
- Sends POST requests to the backend at `http://localhost:8000/api/chat` via `fetch`.

Ensure the endpoint URL in the frontend code is set to `http://localhost:8000/api/chat`.

---

## Project Structure

```text
.
├─ app/                # Next.js App Router (page.tsx, layout.tsx)
│  ├─ page.tsx         # Main chat page
│  └─ about/page.tsx   # About page
├─ components/         # UI components
├─ public/             # Static assets
├─ styles/             # global styles
├─ backend/
│  ├─ app.py           # FastAPI backend, loads X-LoRA model, exposes /api/chat
├─ package.json
├─ pnpm-lock.yaml
├─ requirements.txt    # Python backend dependencies
└─ README.md
```

---

## Research Context (Short)

The backend model is based on **Qwen2.5-0.5B**, part of the Qwen2.5 family of open-weight language models that support multiple languages and show strong performance across a variety of NLP benchmarks.
The `lumicero/Qwen2.5-bilingual-xlora` model is a fine-tuned variant using **LoRA / X-LoRA** (Mixture of LoRA Experts) designed for bilingual English–Indonesian instruction-following.

---

## Important Links

You can update these with your final, public URLs:

- Google Colab project (training and evaluation notebook):  
  https://colab.research.google.com/drive/170KiI3fIibR0g3i0pcochtHwopnoPblq?usp=sharing

- Hugging Face model `lumicero/Qwen2.5-bilingual-xlora`:  
  https://huggingface.co/lumicero/Qwen2.5-bilingual-xlora
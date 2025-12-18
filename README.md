# Waguri AI 🌸
Cross-lingual chatbot web application (Indonesian and English) powered by Qwen2.5-0.5B with Mixture of LoRA Experts (X-LoRA).

Waguri AI is a bilingual chatbot web app built as a demonstration of fine-tuning **Qwen2.5-0.5B** using **Mixture of LoRA Experts (X-LoRA)** for the English–Indonesian pair.

<p align="center">
  <img src="public\Screenshot 2025-12-15 120504.png" alt="Waguri AI main screen" width="720" />
</p>

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
- Virtual environment
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

- Renders the Waguri AI UI (header, welcome hero, central chat card, etc.).
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

## Research Context

The backend model is based on **Qwen2.5-0.5B-Instruct**, part of the Qwen2.5 family of open-weight language models that supports multiple languages ​​and demonstrates strong performance across various NLP benchmarks. The `lumicero/Qwen2.5-bilingual-xlora` model is an enhanced variant using the **X-LoRA Architecture** (Mixture of Low-Rank Adapter Experts) designed to follow English–Indonesian bilingual instructions. The adapters were trained using the `indonlp/cendol_collection_v2` dataset (for Indonesian) & `Open-Orca/OpenOrca` (for English). The adapter creation process involves two stages: the first is to train a **LoRA Expert** for each language, and the second is to combine the two LoRA Experts using the X-LoRA Architecture. The use of this architecture has proven effective in combining the capabilities of two adapters from different domains and equally inheriting both adapter capabilities.

---

## Important Links

- Google Colab project (training and evaluation notebook):  
  [Colab Notebook](https://colab.research.google.com/drive/170KiI3fIibR0g3i0pcochtHwopnoPblq?usp=sharing)

- Hugging Face model `lumicero/Qwen2.5-bilingual-xlora`:  
  [lumicero/Qwen2.5-bilingual-xlora](https://huggingface.co/lumicero/Qwen2.5-bilingual-xlora)

## Contributors
- luminolous (Syauqi Nabil Tasri 5054241040)
- henray404 (Mochammad Henry Alifian 5054241024)
- RXhy (Royan Harits Yustanto 5054241022)

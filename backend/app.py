import time
from typing import List, Optional, Literal

import torch
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftConfig, PeftModel

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
MODEL_DIR = "lumicero/Qwen2.5-bilingual-xlora"

MAX_SEQ_LEN = 1024
MAX_NEW_TOKENS = 128
MAX_INPUT_LENGTH = MAX_SEQ_LEN - MAX_NEW_TOKENS

# Default system prompt kalau user tidak mengisi sendiri.
DEFAULT_SYSTEM_PROMPT = (
    "You are Waguri AI, a friendly bilingual assistant that can speak both "
    "Indonesian and English. Answer clearly, politely, and helpfully. "
    "If the user writes in Indonesian, respond in Indonesian. "
    "If the user writes in English, respond in English."
)


def load_xlora_model():
    print("Loading X-LoRA model from:", MODEL_DIR)

    peft_config = PeftConfig.from_pretrained(MODEL_DIR)
    base_model_name = peft_config.base_model_name_or_path
    print("Base model:", base_model_name)

    tokenizer = AutoTokenizer.from_pretrained(
        MODEL_DIR,
        trust_remote_code=True,
    )
    if tokenizer.pad_token_id is None:
        tokenizer.pad_token = tokenizer.eos_token
    tokenizer.padding_side = "left"

    dtype = torch.bfloat16 if torch.cuda.is_available() else torch.float32

    base_model = AutoModelForCausalLM.from_pretrained(
        base_model_name,
        torch_dtype=dtype,
        device_map=DEVICE,
        trust_remote_code=True,
    )
    base_model.config.use_cache = False

    model = PeftModel.from_pretrained(
        base_model,
        MODEL_DIR,
    )
    model.to(DEVICE)
    model.eval()

    lora_model = model.base_model.lora_model
    numeric_adapter_names = [
        k for k in lora_model.peft_config.keys() if k.isdigit()
    ]
    lora_model.set_adapter(numeric_adapter_names)

    print("LoRA peft_config keys:", list(lora_model.peft_config.keys()))
    print("LoRA active_adapters :", lora_model.active_adapters)
    print("Model & tokenizer X-LoRA siap dipakai")

    return model, tokenizer


MODEL, TOKENIZER = load_xlora_model()


def generate_with_messages_backend(
    messages: List[dict],
    *,
    max_new_tokens: int = MAX_NEW_TOKENS,
    do_sample: bool = True,
    temperature: float = 0.7,
    top_p: float = 0.9,
) -> str:
    """
    Wrapper generate seperti kode referensi, disesuaikan untuk backend.
    messages: list of dicts [{"role": "...", "content": "..."}]
    """
    input_ids = TOKENIZER.apply_chat_template(
        messages,
        tokenize=True,
        add_generation_prompt=True,
        return_tensors="pt",
        truncation=True,
        max_length=MAX_INPUT_LENGTH,
    ).to(DEVICE)

    max_new_tokens = max(1, min(int(max_new_tokens), MAX_NEW_TOKENS))

    generate_kwargs = dict(
        max_new_tokens=max_new_tokens,
        pad_token_id=TOKENIZER.pad_token_id,
        do_sample=bool(do_sample),
    )

    if do_sample:
        temperature = max(float(temperature), 0.01)
        top_p = min(max(float(top_p), 0.01), 1.0)
        generate_kwargs.update(
            dict(
                temperature=temperature,
                top_p=top_p,
            )
        )

    with torch.no_grad():
        outputs = MODEL.generate(
            input_ids=input_ids,
            **generate_kwargs,
        )

    seq_len = input_ids.shape[1]
    generated_tokens = outputs[0, seq_len:]
    text = TOKENIZER.decode(generated_tokens, skip_special_tokens=True)
    return text.strip()

app = FastAPI(
    title="Waguri AI Backend",
    description="Backend untuk Waguri AI Chatbot (Qwen2.5 + X-LoRA).",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str


class ChatConfig(BaseModel):
    system_prompt: Optional[str] = None
    temperature: float = 0.7
    top_p: float = 0.9
    max_tokens: int = MAX_NEW_TOKENS
    do_sample: bool = True


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    config: Optional[ChatConfig] = None


class ChatChoice(BaseModel):
    index: int
    message: ChatMessage
    finish_reason: str


class ChatResponse(BaseModel):
    id: str
    model: str
    created: int
    choices: List[ChatChoice]

def resolve_system_prompt(cfg: ChatConfig) -> str:
    """
    Tentukan system prompt final:
    - Jika cfg.system_prompt tidak kosong, pakai itu (custom user).
    - Kalau tidak, pakai DEFAULT_SYSTEM_PROMPT (bilingual).
    """
    if cfg.system_prompt and cfg.system_prompt.strip():
        return cfg.system_prompt.strip()
    return DEFAULT_SYSTEM_PROMPT


def run_waguri_chat(
    messages: List[ChatMessage],
    cfg: ChatConfig,
) -> str:
    sys_prompt = resolve_system_prompt(cfg)

    msg_dicts: List[dict] = [
        {"role": "system", "content": sys_prompt}
    ]

    for m in messages:
        if m.role in ("user", "assistant"):
            msg_dicts.append(
                {"role": m.role, "content": m.content}
            )

    text = generate_with_messages_backend(
        msg_dicts,
        max_new_tokens=cfg.max_tokens,
        do_sample=cfg.do_sample,
        temperature=cfg.temperature,
        top_p=cfg.top_p,
    )
    return text

@app.get("/health")
def health_check():
    return {"status": "ok", "name": "Waguri AI Backend", "device": DEVICE}


@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(payload: ChatRequest):
    """
    Contoh request body:

    {
      "messages": [
        { "role": "user", "content": "Halo Waguri AI!" }
      ],
      "config": {
        "system_prompt": "You are Waguri AI, ...",   // boleh kosong/null
        "temperature": 0.7,
        "top_p": 0.9,
        "max_tokens": 256,
        "do_sample": true
      }
    }
    """
    cfg = payload.config or ChatConfig()
    messages = payload.messages

    assistant_reply = run_waguri_chat(messages, cfg)

    now = int(time.time())
    response = ChatResponse(
        id=f"waguri-{now}",
        model=MODEL_DIR,
        created=now,
        choices=[
            ChatChoice(
                index=0,
                message=ChatMessage(role="assistant", content=assistant_reply),
                finish_reason="stop",
            )
        ],
    )
    return response

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )

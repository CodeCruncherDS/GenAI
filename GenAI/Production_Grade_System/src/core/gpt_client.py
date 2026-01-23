import os
from typing import Optional, Dict, Any

from openai import OpenAI

from src.core.base_llm import BaseLLM, LLMRequest, LLMResponse


class GPTClient(BaseLLM):
    def __init__(self, model: str, api_key_env: str, base_url: Optional[str] = None):
        api_key = os.getenv(api_key_env)
        if not api_key:
            raise RuntimeError(f"Missing OpenAI key. Set env var: {api_key_env}")

        self.model = model
        self.client = OpenAI(api_key=api_key, base_url=base_url)

    def generate(self, req: LLMRequest) -> LLMResponse:
        messages = []
        if req.system:
            messages.append({"role": "system", "content": req.system})
        messages.append({"role": "user", "content": req.prompt})

        resp = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=req.temperature,
            max_tokens=req.max_tokens,
            timeout=req.timeout_s,
        )

        text = resp.choices[0].message.content or ""
        raw: Dict[str, Any] = {"id": resp.id, "model": resp.model}
        return LLMResponse(text=text, raw=raw)

import os
from anthropic import Anthropic
from src.core.base_llm import BaseLLM, LLMRequest, LLMResponse

class ClaudeClient(BaseLLM):
    def __init__(self, model: str, api_key_env: str):
        api_key = os.getenv(api_key_env)
        if not api_key:
            raise RuntimeError(f"Missing Anthropic key. Set env var: {api_key_env}")
        self.model = model
        self.client = Anthropic(api_key=api_key)

    def generate(self, req: LLMRequest) -> LLMResponse:
        system = req.system or ""
        resp = self.client.messages.create(
            model=self.model,
            max_tokens=req.max_tokens,
            temperature=req.temperature,
            system=system,
            messages=[{"role": "user", "content": req.prompt}],
        )
        text = ""
        for block in resp.content:
            if getattr(block, "type", None) == "text":
                text += block.text
        return LLMResponse(text=text, raw={"id": resp.id, "model": self.model})

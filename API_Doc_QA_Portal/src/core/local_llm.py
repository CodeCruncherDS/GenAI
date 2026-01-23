import requests
from src.core.base_llm import BaseLLM, LLMRequest, LLMResponse

class LocalLLM(BaseLLM):
    def __init__(self, endpoint: str, model: str):
        self.endpoint = endpoint
        self.model = model

    def generate(self, req: LLMRequest) -> LLMResponse:
        payload = {
            "model": self.model,
            "prompt": req.prompt,
            "system": req.system,
            "temperature": req.temperature,
            "max_tokens": req.max_tokens,
        }
        r = requests.post(self.endpoint, json=payload, timeout=req.timeout_s)
        r.raise_for_status()
        data = r.json()
        return LLMResponse(text=data.get("text", ""), raw=data)

from typing import Dict, Any
from src.core.base_llm import BaseLLM
from src.core.gpt_client import GPTClient
from src.core.claude_client import ClaudeClient
from src.core.local_llm import LocalLLM

def create_llm(cfg: Dict[str, Any]) -> BaseLLM:
    llm_cfg = cfg["llm"]
    provider = llm_cfg["provider"]
    model = llm_cfg["model"]
    providers = cfg.get("providers", {})

    if provider == "openai":
        p = providers["openai"]
        return GPTClient(model=model, api_key_env=p["api_key_env"], base_url=p.get("base_url"))

    if provider == "anthropic":
        p = providers["anthropic"]
        return ClaudeClient(model=model, api_key_env=p["api_key_env"])

    if provider == "local":
        p = providers["local"]
        return LocalLLM(endpoint=p["endpoint"], model=model)

    raise ValueError(f"Unsupported provider: {provider}")

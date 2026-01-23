import pytest
from src.core.base_llm import LLMRequest
from src.core.local_llm import LocalLLM


def test_local_llm_requires_endpoint():
    llm = LocalLLM(endpoint="http://localhost:9999", model="x")
    req = LLMRequest(prompt="hi", temperature=0.0, max_tokens=5, timeout_s=1)
    with pytest.raises(Exception):
        llm.generate(req)

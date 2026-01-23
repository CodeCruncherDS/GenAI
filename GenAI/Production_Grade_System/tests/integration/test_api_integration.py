import os
import pytest
import yaml
from src.inference.inference_engine import InferenceEngine


@pytest.mark.skipif(not os.getenv("OPENAI_API_KEY"), reason="OPENAI_API_KEY not set")
def test_openai_call_smoke():
    cfg = yaml.safe_load(open("config/model_config.yaml", "r", encoding="utf-8"))
    cfg["llm"]["provider"] = "openai"
    engine = InferenceEngine(cfg)
    out = engine.run("Say 'ok' only.")
    assert "ok" in out.answer.lower()

import yaml
from src.inference.inference_engine import InferenceEngine


def test_engine_initializes():
    cfg = yaml.safe_load(open("config/model_config.yaml", "r", encoding="utf-8"))
    engine = InferenceEngine(cfg)
    assert engine is not None

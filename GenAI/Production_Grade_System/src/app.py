import argparse
import logging
import logging.config
from pathlib import Path

import yaml

from src.inference.inference_engine import InferenceEngine

LOGGER = logging.getLogger("app")


def load_yaml(path: str) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def setup_logging(logging_cfg_path: str) -> None:
    cfg = load_yaml(logging_cfg_path)
    logging.config.dictConfig(cfg)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", default="config/model_config.yaml")
    parser.add_argument("--logging", default="config/logging_config.yaml")
    parser.add_argument("--question", required=True)
    args = parser.parse_args()

    setup_logging(args.logging)
    cfg = load_yaml(args.config)

    # Ensure data directories exist
    Path(cfg["paths"]["cache_dir"]).mkdir(parents=True, exist_ok=True)
    Path(cfg["paths"]["embeddings_dir"]).mkdir(parents=True, exist_ok=True)
    Path(cfg["paths"]["vectordb_dir"]).mkdir(parents=True, exist_ok=True)

    engine = InferenceEngine(cfg)
    result = engine.run(question=args.question)

    print(result.model_dump_json(indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

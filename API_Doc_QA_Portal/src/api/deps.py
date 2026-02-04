from typing import Optional
import logging.config
from functools import lru_cache
from pathlib import Path

import yaml

BASE_DIR = Path(__file__).resolve().parents[2]
CONFIG_PATH = BASE_DIR / "config" / "model_config.yaml"
LOGGING_PATH = BASE_DIR / "config" / "logging_config.yaml"


def _resolve_path(value: Optional[str]) -> Optional[str]:
    if not value:
        return value
    path = BASE_DIR / value
    path.mkdir(parents=True, exist_ok=True)
    return str(path)


@lru_cache(maxsize=1)
def get_config() -> dict:
    with open(LOGGING_PATH, "r", encoding="utf-8") as f:
        logging.config.dictConfig(yaml.safe_load(f))

    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        cfg = yaml.safe_load(f)

    rag_cfg = cfg.get("rag", {})
    if "vectordb_path" in rag_cfg:
        rag_cfg["vectordb_path"] = _resolve_path(rag_cfg["vectordb_path"])

    paths = cfg.get("paths", {})
    for key, value in paths.items():
        paths[key] = _resolve_path(value)

    return cfg

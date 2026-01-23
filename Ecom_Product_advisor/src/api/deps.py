import yaml
import logging.config
from functools import lru_cache

CONFIG_PATH = "config/model_config.yaml"
LOGGING_PATH = "config/logging_config.yaml"

@lru_cache(maxsize=1)
def get_config() -> dict:
    with open(LOGGING_PATH, "r", encoding="utf-8") as f:
        logging.config.dictConfig(yaml.safe_load(f))
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)

from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional, Dict, Any

@dataclass(frozen=True)
class LLMRequest:
    prompt: str
    temperature: float
    max_tokens: int
    timeout_s: int
    system: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

@dataclass(frozen=True)
class LLMResponse:
    text: str
    raw: Optional[Dict[str, Any]] = None

class BaseLLM(ABC):
    @abstractmethod
    def generate(self, req: LLMRequest) -> LLMResponse:
        raise NotImplementedError

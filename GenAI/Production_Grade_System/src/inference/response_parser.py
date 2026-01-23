from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional


class InferenceResult(BaseModel):
    answer: str
    sources: List[Dict[str, Any]] = Field(default_factory=list)
    model: str
    provider: str
    raw: Optional[Dict[str, Any]] = None

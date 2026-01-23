from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional

class Recommendation(BaseModel):
    sku: str
    why: str
    pros: List[str] = Field(default_factory=list)
    cons: List[str] = Field(default_factory=list)
    best_for: str

class AdvisorResult(BaseModel):
    recommendations: List[Recommendation] = Field(default_factory=list)
    shortlist_skus: List[str] = Field(default_factory=list)
    followups: List[str] = Field(default_factory=list)

class InferenceResult(BaseModel):
    answer_text: str
    structured: Optional[AdvisorResult] = None
    sources: List[Dict[str, Any]] = Field(default_factory=list)
    model: str
    provider: str
    raw: Optional[Dict[str, Any]] = None

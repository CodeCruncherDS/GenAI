from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional
from src.inference.response_parser import AdvisorResult

class QueryRequest(BaseModel):
    question: str = Field(min_length=1)
    shop: str = Field(default="default")

class SourceHit(BaseModel):
    text: str
    metadata: Dict[str, Any] = Field(default_factory=dict)
    distance: float

class QueryResponse(BaseModel):
    structured: Optional[AdvisorResult] = None
    raw_answer: str
    sources: List[SourceHit] = Field(default_factory=list)
    provider: str
    model: str

class IngestResponse(BaseModel):
    indexed_items: int
    indexed_chunks: int
    shop: str

class CompareRequest(BaseModel):
    skus: List[str] = Field(min_length=2, max_length=6)
    shop: str = Field(default="default")

class CompareResponse(BaseModel):
    answer: str
    provider: str
    model: str

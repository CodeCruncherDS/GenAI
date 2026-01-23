from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class QueryRequest(BaseModel):
    question: str = Field(min_length=1)
    project: str = Field(default="default")

class SourceHit(BaseModel):
    text: str
    metadata: Dict[str, Any] = Field(default_factory=dict)
    distance: float

class QueryResponse(BaseModel):
    answer: str
    sources: List[SourceHit] = Field(default_factory=list)
    provider: str
    model: str
    raw: Optional[Dict[str, Any]] = None

class IngestResponse(BaseModel):
    indexed_chunks: int
    project: str

import json
from typing import Any, Dict, List, Optional
from src.core.model_factory import create_llm
from src.core.base_llm import LLMRequest
from src.prompts.templates import system_default, product_advisor_prompt
from src.rag.embedder import Embedder
from src.rag.vector_store import VectorStore
from src.rag.retriever import Retriever
from src.inference.response_parser import InferenceResult, AdvisorResult

def _safe_json_load(s: str) -> Optional[dict]:
    s = s.strip()
    start = s.find("{")
    end = s.rfind("}")
    if start >= 0 and end > start:
        s = s[start:end+1]
    try:
        return json.loads(s)
    except Exception:
        return None

class InferenceEngine:
    def __init__(self, cfg: Dict[str, Any], collection_name: Optional[str] = None):
        self.cfg = cfg
        self.llm = create_llm(cfg)
        rag_cfg = cfg["rag"]
        self.collection_name = collection_name or rag_cfg["collection_name"]
        self.embedder = Embedder(rag_cfg["embedding_model"])
        self.store = VectorStore(persist_path=rag_cfg["vectordb_path"], collection_name=self.collection_name)
        self.retriever = Retriever(embedder=self.embedder, store=self.store, top_k=rag_cfg["top_k"])

    def run(self, question: str) -> InferenceResult:
        llm_cfg = self.cfg["llm"]
        provider = llm_cfg["provider"]
        model = llm_cfg["model"]

        contexts: List[dict] = self.retriever.retrieve(question)
        prompt = product_advisor_prompt(question, [{"text": c["text"]} for c in contexts])

        req = LLMRequest(
            prompt=prompt,
            system=system_default(),
            temperature=float(llm_cfg["temperature"]),
            max_tokens=int(llm_cfg["max_tokens"]),
            timeout_s=int(llm_cfg["timeout_s"]),
        )
        resp = self.llm.generate(req)
        parsed = _safe_json_load(resp.text)
        structured = AdvisorResult(**parsed) if parsed else None

        return InferenceResult(
            answer_text=resp.text.strip(),
            structured=structured,
            sources=contexts,
            model=model,
            provider=provider,
            raw=resp.raw,
        )

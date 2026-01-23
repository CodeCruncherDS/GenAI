import logging
from typing import Dict, Any, List
from src.core.model_factory import create_llm
from src.core.base_llm import LLMRequest
from src.prompts.templates import system_default, api_doc_rag_prompt
from src.rag.embedder import Embedder
from src.rag.vector_store import VectorStore
from src.rag.retriever import Retriever
from src.inference.response_parser import InferenceResult

LOGGER = logging.getLogger("inference")

class InferenceEngine:
    def __init__(self, cfg: Dict[str, Any]):
        self.cfg = cfg
        self.llm = create_llm(cfg)

        rag_cfg = cfg["rag"]
        self.embedder = Embedder(rag_cfg["embedding_model"])
        self.store = VectorStore(persist_path=rag_cfg["vectordb_path"], collection_name=rag_cfg["collection_name"])
        self.retriever = Retriever(embedder=self.embedder, store=self.store, top_k=rag_cfg["top_k"])

    def run(self, question: str) -> InferenceResult:
        llm_cfg = self.cfg["llm"]
        provider = llm_cfg["provider"]
        model = llm_cfg["model"]

        contexts: List[dict] = self.retriever.retrieve(question)
        prompt = api_doc_rag_prompt(question, [{"text": c["text"]} for c in contexts])

        req = LLMRequest(
            prompt=prompt,
            system=system_default(),
            temperature=float(llm_cfg["temperature"]),
            max_tokens=int(llm_cfg["max_tokens"]),
            timeout_s=int(llm_cfg["timeout_s"]),
        )
        resp = self.llm.generate(req)

        return InferenceResult(
            answer=resp.text.strip(),
            sources=contexts,
            model=model,
            provider=provider,
            raw=resp.raw,
        )

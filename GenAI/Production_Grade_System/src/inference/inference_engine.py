import logging
from typing import Dict, Any, List

from src.core.model_factory import create_llm
from src.core.base_llm import LLMRequest
from src.prompts.templates import system_default, rag_prompt
from src.rag.embedder import Embedder
from src.rag.vector_store import VectorStore
from src.rag.retriever import Retriever
from src.inference.response_parser import InferenceResult

LOGGER = logging.getLogger("inference")


class InferenceEngine:
    def __init__(self, cfg: Dict[str, Any]):
        self.cfg = cfg
        self.llm = create_llm(cfg)

        self.rag_enabled = bool(cfg.get("rag", {}).get("enabled", False))
        self.retriever = None

        if self.rag_enabled:
            rag_cfg = cfg["rag"]
            embedder = Embedder(rag_cfg["embedding_model"])
            store = VectorStore(
                persist_path=rag_cfg["vectordb_path"],
                collection_name=rag_cfg["collection_name"],
            )
            self.retriever = Retriever(embedder=embedder, store=store, top_k=rag_cfg["top_k"])

    def run(self, question: str) -> InferenceResult:
        llm_cfg = self.cfg["llm"]
        provider = llm_cfg["provider"]
        model = llm_cfg["model"]

        contexts: List[dict] = []
        prompt = question

        if self.rag_enabled and self.retriever is not None:
            contexts = self.retriever.retrieve(question)
            prompt = rag_prompt(question, [{"text": c["text"]} for c in contexts])

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

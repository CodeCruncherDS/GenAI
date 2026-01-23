from typing import List, Dict, Any
from src.rag.embedder import Embedder
from src.rag.vector_store import VectorStore

class Retriever:
    def __init__(self, embedder: Embedder, store: VectorStore, top_k: int):
        self.embedder = embedder
        self.store = store
        self.top_k = top_k

    def retrieve(self, query: str) -> List[Dict[str, Any]]:
        q_emb = self.embedder.embed([query])[0]
        return self.store.query(query_embedding=q_emb, top_k=self.top_k)

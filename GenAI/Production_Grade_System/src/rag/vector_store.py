from typing import List, Dict, Any, Optional

import chromadb
from chromadb.config import Settings


class VectorStore:
    def __init__(self, persist_path: str, collection_name: str):
        self.client = chromadb.PersistentClient(path=persist_path, settings=Settings(anonymized_telemetry=False))
        self.collection = self.client.get_or_create_collection(name=collection_name)

    def upsert(self, ids: List[str], documents: List[str], embeddings: List[list], metadatas: Optional[List[Dict[str, Any]]] = None) -> None:
        self.collection.upsert(
            ids=ids,
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas,
        )

    def query(self, query_embedding: list, top_k: int) -> List[Dict[str, Any]]:
        res = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            include=["documents", "metadatas", "distances"],
        )
        docs = res["documents"][0] if res.get("documents") else []
        metas = res["metadatas"][0] if res.get("metadatas") else []
        dists = res["distances"][0] if res.get("distances") else []

        out: List[Dict[str, Any]] = []
        for i in range(len(docs)):
            out.append({"text": docs[i], "metadata": metas[i], "distance": dists[i]})
        return out

import hashlib
from typing import List, Dict, Any, Optional
from src.processing.preprocessor import normalize_text
from src.processing.chunking import chunk_text
from src.rag.embedder import Embedder
from src.rag.vector_store import VectorStore

class Indexer:
    def __init__(self, embedder: Embedder, store: VectorStore, chunk_size: int, chunk_overlap: int):
        self.embedder = embedder
        self.store = store
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def index_documents(self, docs: List[str], metadatas: Optional[List[Dict[str, Any]]] = None) -> int:
        metadatas = metadatas or [{} for _ in docs]
        all_chunks: List[str] = []
        all_ids: List[str] = []
        all_metas: List[Dict[str, Any]] = []

        for doc, meta in zip(docs, metadatas):
            text = normalize_text(doc)
            chunks = chunk_text(text, self.chunk_size, self.chunk_overlap)
            for c in chunks:
                cid = hashlib.sha256((c + str(meta)).encode("utf-8")).hexdigest()
                all_chunks.append(c)
                all_ids.append(cid)
                all_metas.append(meta)

        embeddings = self.embedder.embed(all_chunks)
        self.store.upsert(ids=all_ids, documents=all_chunks, embeddings=embeddings, metadatas=all_metas)
        return len(all_chunks)

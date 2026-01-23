from typing import List
from sentence_transformers import SentenceTransformer

class Embedder:
    def __init__(self, model_name: str):
        self.model = SentenceTransformer(model_name)

    def embed(self, texts: List[str]) -> List[list]:
        vecs = self.model.encode(texts, normalize_embeddings=True)
        return [v.tolist() for v in vecs]

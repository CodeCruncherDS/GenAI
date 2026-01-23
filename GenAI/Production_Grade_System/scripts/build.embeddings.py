import argparse
import yaml

from src.rag.embedder import Embedder
from src.rag.vector_store import VectorStore
from src.rag.indexer import Indexer


def load_yaml(p: str) -> dict:
    with open(p, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", default="config/model_config.yaml")
    ap.add_argument("--text_file", required=True, help="Plain text file to index")
    ap.add_argument("--source_name", default="manual")
    args = ap.parse_args()

    cfg = load_yaml(args.config)
    rag = cfg["rag"]

    embedder = Embedder(rag["embedding_model"])
    store = VectorStore(rag["vectordb_path"], rag["collection_name"])
    indexer = Indexer(embedder, store, rag["chunking"]["chunk_size"], rag["chunking"]["chunk_overlap"])

    with open(args.text_file, "r", encoding="utf-8") as f:
        text = f.read()

    n = indexer.index_documents([text], metadatas=[{"source": args.source_name, "path": args.text_file}])
    print(f"Indexed chunks: {n}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

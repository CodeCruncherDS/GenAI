from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from src.api.schemas import QueryRequest, QueryResponse, IngestResponse, SourceHit
from src.api.deps import get_config
from src.processing.openapi_parser import parse_openapi_or_markdown
from src.rag.embedder import Embedder
from src.rag.vector_store import VectorStore
from src.rag.indexer import Indexer
from src.inference.inference_engine import InferenceEngine

router = APIRouter()

@router.post("/query", response_model=QueryResponse)
def query(req: QueryRequest):
    cfg = get_config()
    cfg = dict(cfg)
    cfg["rag"] = dict(cfg["rag"])
    cfg["rag"]["collection_name"] = f"docs_{req.project}"

    engine = InferenceEngine(cfg)
    out = engine.run(req.question)

    sources = [
        SourceHit(text=s.get("text", ""), metadata=s.get("metadata", {}), distance=float(s.get("distance", 0.0)))
        for s in out.sources
    ]
    return QueryResponse(
        answer=out.answer,
        sources=sources,
        provider=out.provider,
        model=out.model,
        raw=out.raw,
    )

@router.post("/ingest", response_model=IngestResponse)
async def ingest(project: str = Form(default="default"), file: UploadFile = File(...)):
    cfg = get_config()
    rag = cfg["rag"]
    collection_name = f"docs_{project}"

    raw = await file.read()
    try:
        text_blobs, metas = parse_openapi_or_markdown(raw, filename=file.filename)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Parse failed: {e}")

    embedder = Embedder(rag["embedding_model"])
    store = VectorStore(rag["vectordb_path"], collection_name)
    indexer = Indexer(embedder, store, rag["chunking"]["chunk_size"], rag["chunking"]["chunk_overlap"])
    n = indexer.index_documents(text_blobs, metadatas=metas)

    return IngestResponse(indexed_chunks=n, project=project)

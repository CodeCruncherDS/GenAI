import hashlib
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from src.api.deps import get_config
from src.api.schemas import QueryRequest, QueryResponse, IngestResponse, SourceHit, CompareRequest, CompareResponse
from src.processing.catalog_parser import parse_catalog
from src.rag.embedder import Embedder
from src.rag.vector_store import VectorStore
from src.rag.indexer import Indexer
from src.inference.inference_engine import InferenceEngine
from src.core.base_llm import LLMRequest
from src.core.model_factory import create_llm

router = APIRouter()

def _product_to_doc(p) -> str:
    attrs = ", ".join([f"{k}={v}" for k, v in (p.attributes or {}).items()])
    return (
        f"SKU: {p.sku}\n"
        f"Title: {p.title}\n"
        f"Brand: {p.brand}\n"
        f"Category: {p.category}\n"
        f"Price: {p.price} {p.currency}\n"
        f"Rating: {p.rating}\n"
        f"InStock: {p.in_stock}\n"
        f"Attributes: {attrs}\n"
        f"Description: {p.description}\n"
        f"URL: {p.url}\n"
    ).strip()

@router.post("/ingest/catalog", response_model=IngestResponse)
async def ingest_catalog(shop: str = Form(default="default"), file: UploadFile = File(...)):
    cfg = get_config()
    rag = cfg["rag"]
    collection_name = f"products_{shop}"

    raw = await file.read()
    try:
        products = parse_catalog(raw, file.filename)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Catalog parse failed: {e}")

    docs, metas = [], []
    for p in products:
        docs.append(_product_to_doc(p))
        metas.append({
            "sku": p.sku, "title": p.title, "brand": p.brand, "category": p.category,
            "price": p.price, "currency": p.currency, "url": p.url
        })

    embedder = Embedder(rag["embedding_model"])
    store = VectorStore(rag["vectordb_path"], collection_name)
    indexer = Indexer(embedder, store, rag["chunking"]["chunk_size"], rag["chunking"]["chunk_overlap"])
    indexed_chunks = indexer.index_documents(docs, metadatas=metas)

    return IngestResponse(indexed_items=len(products), indexed_chunks=indexed_chunks, shop=shop)

@router.post("/query", response_model=QueryResponse)
def query(req: QueryRequest):
    cfg = get_config()
    collection_name = f"products_{req.shop}"
    engine = InferenceEngine(cfg, collection_name=collection_name)
    out = engine.run(req.question)

    sources = [
        SourceHit(text=s.get("text", ""), metadata=s.get("metadata", {}), distance=float(s.get("distance", 0.0)))
        for s in out.sources
    ]
    return QueryResponse(
        structured=out.structured,
        raw_answer=out.answer_text,
        sources=sources,
        provider=out.provider,
        model=out.model,
    )

@router.post("/compare", response_model=CompareResponse)
def compare(req: CompareRequest):
    cfg = get_config()
    rag = cfg["rag"]
    collection_name = f"products_{req.shop}"

    embedder = Embedder(rag["embedding_model"])
    store = VectorStore(rag["vectordb_path"], collection_name)

    ctx = []
    for sku in req.skus:
        q_emb = embedder.embed([f"SKU: {sku}"])[0]
        hits = store.query(q_emb, top_k=1)
        if hits:
            ctx.append(hits[0]["text"])

    prompt = (
        "Compare these products and recommend one based on typical buyer priorities "
        "(value, reliability, features). Use only the context.\n\n"
        + "\n\n---\n\n".join(ctx)
        + "\n\nReturn: best_choice_sku, why, 3 pros, 3 cons."
    )

    llm = create_llm(cfg)
    llm_cfg = cfg["llm"]
    resp = llm.generate(
        LLMRequest(
            prompt=prompt,
            system="You are a product comparison assistant.",
            temperature=0.2,
            max_tokens=700,
            timeout_s=int(llm_cfg["timeout_s"]),
        )
    )
    return CompareResponse(answer=resp.text.strip(), provider=llm_cfg["provider"], model=llm_cfg["model"])

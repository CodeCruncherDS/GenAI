from typing import List, Dict

def system_default() -> str:
    return (
        "You answer questions about an API. "
        "Be exact. Prefer endpoints, parameters, request/response examples. "
        "If the docs do not contain the answer, say that explicitly."
    )

def api_doc_rag_prompt(question: str, contexts: List[Dict[str, str]]) -> str:
    ctx = "\n\n".join([f"[Doc {i+1}]\n{c['text']}" for i, c in enumerate(contexts)])
    return (
        "Use only the provided documentation context.\n"
        "Return:\n"
        "1) Direct answer\n"
        "2) Endpoint(s)\n"
        "3) Parameters\n"
        "4) Example request/response if possible\n\n"
        f"CONTEXT:\n{ctx}\n\nQUESTION:\n{question}\n\nANSWER:"
    )

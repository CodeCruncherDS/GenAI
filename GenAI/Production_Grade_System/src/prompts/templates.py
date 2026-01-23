from typing import List, Dict


def system_default() -> str:
    return (
        "You are a production assistant. Be concise, correct, and grounded. "
        "If context is provided, use it. If unknown, say you don't know."
    )


def rag_prompt(question: str, contexts: List[Dict[str, str]]) -> str:
    ctx_text = "\n\n".join(
        [f"[Source {i+1}] {c['text']}" for i, c in enumerate(contexts)]
    )
    return (
        "Answer the question using the provided context. "
        "If the context is insufficient, say so.\n\n"
        f"Context:\n{ctx_text}\n\n"
        f"Question: {question}\n"
        "Answer:"
    )

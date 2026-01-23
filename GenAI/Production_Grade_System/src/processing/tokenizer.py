def approx_token_count(text: str) -> int:
    # Rough heuristic: ~4 chars/token for English-ish text.
    return max(1, len(text) // 4)

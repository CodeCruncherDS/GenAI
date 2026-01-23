from src.prompts.templates import rag_prompt


def test_rag_prompt_contains_question():
    p = rag_prompt("What is X?", [{"text": "ctx1"}])
    assert "What is X?" in p
    assert "ctx1" in p

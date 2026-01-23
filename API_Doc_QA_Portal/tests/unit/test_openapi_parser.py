from src.processing.openapi_parser import parse_openapi_or_markdown

def test_parse_markdown():
    docs, metas = parse_openapi_or_markdown(b"# Title\nhello", "x.md")
    assert len(docs) == 1
    assert metas[0]["type"] == "markdown"

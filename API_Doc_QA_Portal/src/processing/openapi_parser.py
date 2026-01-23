from __future__ import annotations
import json
from typing import Tuple, List, Dict, Any
import yaml

def _as_text(d: dict) -> str:
    parts: List[str] = []
    info = d.get("info", {}) or {}
    title = info.get("title", "API")
    version = info.get("version", "")
    parts.append(f"{title} {version}".strip())

    servers = d.get("servers", []) or []
    if servers:
        parts.append("Servers:\n" + "\n".join([s.get("url", "") for s in servers if s.get("url")]))

    paths = d.get("paths", {}) or {}
    for path, methods in paths.items():
        if not isinstance(methods, dict):
            continue
        for m, spec in methods.items():
            if not isinstance(spec, dict):
                continue
            op_id = spec.get("operationId", "")
            summary = spec.get("summary", "")
            desc = spec.get("description", "")
            parts.append(
                f"Endpoint: {m.upper()} {path}\n"
                f"operationId: {op_id}\n"
                f"summary: {summary}\n"
                f"description: {desc}".strip()
            )

            params = spec.get("parameters", []) or []
            if params:
                p_lines = []
                for p in params:
                    if not isinstance(p, dict):
                        continue
                    schema = p.get("schema") or {}
                    p_lines.append(
                        f"- {p.get('name','')} in={p.get('in','')} required={p.get('required',False)} "
                        f"type={schema.get('type','')} desc={p.get('description','')}"
                    )
                parts.append("Parameters:\n" + "\n".join(p_lines))

            rb = (spec.get("requestBody") or {})
            if rb:
                parts.append("RequestBody:\n" + json.dumps(rb, ensure_ascii=False)[:4000])

            responses = spec.get("responses", {}) or {}
            if responses:
                parts.append("Responses:\n" + json.dumps(responses, ensure_ascii=False)[:4000])

    return "\n\n---\n\n".join([p for p in parts if p])

def parse_openapi_or_markdown(raw: bytes, filename: str) -> Tuple[List[str], List[Dict[str, Any]]]:
    name = (filename or "upload").lower()

    if name.endswith(".md") or name.endswith(".txt"):
        text = raw.decode("utf-8", errors="ignore")
        return [text], [{"source": filename, "type": "markdown"}]

    if name.endswith(".json"):
        d = json.loads(raw.decode("utf-8", errors="ignore"))
        return [_as_text(d)], [{"source": filename, "type": "openapi"}]

    if name.endswith(".yaml") or name.endswith(".yml"):
        d = yaml.safe_load(raw.decode("utf-8", errors="ignore"))
        return [_as_text(d)], [{"source": filename, "type": "openapi"}]

    raise ValueError("Unsupported file type. Upload .json/.yaml/.yml/.md/.txt")

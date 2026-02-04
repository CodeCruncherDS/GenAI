from __future__ import annotations
import json
from typing import Tuple, List, Dict, Any
import yaml

def _parse_openapi_endpoints(d: dict, filename: str) -> Tuple[List[str], List[Dict[str, Any]]]:
    chunks: List[str] = []
    metas: List[Dict[str, Any]] = []

    info = d.get("info", {}) or {}
    title = info.get("title", "API")
    version = info.get("version", "")
    
    # Global Info Chunk
    global_info = f"API: {title} {version}\n"
    servers = d.get("servers", []) or []
    if servers:
        global_info += "Servers:\n" + "\n".join([s.get("url", "") for s in servers if s.get("url")])
    chunks.append(global_info)
    metas.append({"source": filename, "type": "openapi", "section": "info"})

    # Paths
    paths = d.get("paths", {}) or {}
    for path, methods in paths.items():
        if not isinstance(methods, dict):
            continue
        for m, spec in methods.items():
            if not isinstance(spec, dict):
                continue
            
            # Extract Details
            op_id = spec.get("operationId", "")
            summary = spec.get("summary", "")
            desc = spec.get("description", "")
            
            # Construct Content
            content = (
                f"Endpoint: {m.upper()} {path}\n"
                f"operationId: {op_id}\n"
                f"summary: {summary}\n"
                f"description: {desc}\n"
            ).strip()

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
                content += "\nParameters:\n" + "\n".join(p_lines)

            rb = (spec.get("requestBody") or {})
            if rb:
                content += "\nRequestBody:\n" + json.dumps(rb, ensure_ascii=False)[:3000]

            responses = spec.get("responses", {}) or {}
            if responses:
                content += "\nResponses:\n" + json.dumps(responses, ensure_ascii=False)[:3000]

            chunks.append(content)
            metas.append({
                "source": filename,
                "type": "openapi",
                "method": m.upper(),
                "path": path,
                "operationId": op_id
            })

    return chunks, metas

def parse_openapi_or_markdown(raw: bytes, filename: str) -> Tuple[List[str], List[Dict[str, Any]]]:
    name = (filename or "upload").lower()

    if name.endswith(".md") or name.endswith(".txt"):
        text = raw.decode("utf-8", errors="ignore")
        return [text], [{"source": filename, "type": "markdown"}]

    if name.endswith(".json"):
        d = json.loads(raw.decode("utf-8", errors="ignore"))
        return _parse_openapi_endpoints(d, filename)

    if name.endswith(".yaml") or name.endswith(".yml"):
        d = yaml.safe_load(raw.decode("utf-8", errors="ignore"))
        return _parse_openapi_endpoints(d, filename)

    raise ValueError("Unsupported file type. Upload .json/.yaml/.yml/.md/.txt")

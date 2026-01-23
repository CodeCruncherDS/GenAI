from __future__ import annotations
import csv
import json
from dataclasses import dataclass
from typing import Any, Dict, List, Optional

@dataclass(frozen=True)
class Product:
    sku: str
    title: str
    brand: str
    category: str
    price: float
    currency: str
    rating: Optional[float]
    in_stock: bool
    url: Optional[str]
    description: str
    attributes: Dict[str, Any]

def _to_bool(x: Any) -> bool:
    if isinstance(x, bool):
        return x
    s = str(x).strip().lower()
    return s in {"1", "true", "yes", "y", "in_stock", "available"}

def _to_float(x: Any) -> Optional[float]:
    if x is None or x == "":
        return None
    try:
        return float(str(x).replace(",", "").strip())
    except Exception:
        return None

def parse_catalog(raw: bytes, filename: str) -> List[Product]:
    name = (filename or "upload").lower()

    if name.endswith(".json"):
        data = json.loads(raw.decode("utf-8", errors="ignore"))
        items = data if isinstance(data, list) else data.get("items", [])
        out: List[Product] = []
        for it in items:
            out.append(
                Product(
                    sku=str(it.get("sku") or it.get("id") or it.get("product_id") or ""),
                    title=str(it.get("title") or it.get("name") or ""),
                    brand=str(it.get("brand") or ""),
                    category=str(it.get("category") or ""),
                    price=float(it.get("price") or 0.0),
                    currency=str(it.get("currency") or "USD"),
                    rating=_to_float(it.get("rating")),
                    in_stock=_to_bool(it.get("in_stock", True)),
                    url=it.get("url"),
                    description=str(it.get("description") or ""),
                    attributes=dict(it.get("attributes") or {}),
                )
            )
        return out

    if name.endswith(".csv"):
        text = raw.decode("utf-8", errors="ignore")
        reader = csv.DictReader(text.splitlines())
        out: List[Product] = []
        for r in reader:
            out.append(
                Product(
                    sku=str(r.get("sku") or r.get("id") or r.get("product_id") or ""),
                    title=str(r.get("title") or r.get("name") or ""),
                    brand=str(r.get("brand") or ""),
                    category=str(r.get("category") or ""),
                    price=float((r.get("price") or "0").replace(",", "")),
                    currency=str(r.get("currency") or "USD"),
                    rating=_to_float(r.get("rating")),
                    in_stock=_to_bool(r.get("in_stock", "true")),
                    url=r.get("url"),
                    description=str(r.get("description") or ""),
                    attributes={k: v for k, v in r.items() if k and k.startswith("attr_")},
                )
            )
        return out

    raise ValueError("Unsupported catalog type. Upload .csv or .json")

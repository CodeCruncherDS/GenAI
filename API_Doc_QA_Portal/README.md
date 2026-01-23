# API Documentation Q&A Portal (FastAPI + Next.js)

## Run with Docker
```bash
export OPENAI_API_KEY=...
docker compose up --build
# Web: http://localhost:3000
# API docs: http://localhost:8000/docs
```

## Run locally (dev)
Backend:
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export OPENAI_API_KEY=...
uvicorn src.api.main:app --reload --port 8000
```

Frontend:
```bash
cd web
npm install
NEXT_PUBLIC_API_BASE=http://localhost:8000 npm run dev
```

## Use
1) Upload an OpenAPI spec (.json/.yaml/.yml) or Markdown (.md)
2) Ask questions; answers include retrieved context.

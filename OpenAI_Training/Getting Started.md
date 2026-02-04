## Getting Started
### Partner Bootcamp
Advanced, hands-on training for enterprise builders to scope, design, and deploy AI solutions. Focus areas: agents, RAG, and evals — with practical, production-oriented patterns.
Labs overview
Evals — build a practical evaluation harness that combines model-based scoring and deterministic checks to grade datasets.
Multimodality - Build Realtime and chained architecture approaches using OpenAI APIs
AgentKit - End to end workshop track on agent builder, evals and chatkit deployment.
Apps SDK - implement apps hosted in chatgpt developer ecosystem using MCP and react framework
Codex Lab - Learn how to optimize your workflows using OpenAI coding tools and dive deep into setting up productivity tooling within your ecosystem.
Prompt Optimization - Learn different prompt optimization techniques using OpenAI tooling and GEPA auto-optimizer
Agents — implement robust tools, a baseline agent, routing/handoffs between agents, and input guardrails.
RAG — create a vector-store-backed retrieval pipeline and generate grounded answers; evaluate end-to-end quality.
Prerequisites
Python 3.10+ (3.12 preferred)
Install dependencies via the quick setup script below (or follow manual instructions in each lab’s README.md).
API key: set OPENAI_API_KEY in your environment for API-backed steps.
Project + Organization IDs: set OPENAI_PROJECT_ID and OPENAI_ORGANIZATION_ID so File Search and other stateful services resolve to the right OpenAI workspace. Zero-Data-Retention (ZDR) projects are not compatible with these labs.
Still need the web app stack for the sample frontends? Use Node.js 18+, npm 10+, Postgres (with pgvector), Redis, optional OpenSearch, plus ffmpeg + Chrome for multimedia demos.
Quick Setup
Quick start (recommended): run the OS-specific setup script from the repo root to create a virtual environment and install dependencies.
Disclaimer

The setup scripts will install developer tooling if missing (e.g., Homebrew on macOS), install packages via Homebrew (such as pyenv, python@3.12, jq), and create a project-local virtual environment (.venv). These operations modify your Homebrew installation and may download binaries. If you prefer full control over your environment, skip the scripts and follow the manual steps below to create/activate a venv and install dependencies.
Important: After running the automated or manual setup, export your OpenAI credentials (OPENAI_API_KEY, OPENAI_PROJECT_ID, OPENAI_ORGANIZATION_ID) for this shell. See “Setup OpenAI API key” below.
Manual Setup (if preferred)
Create and activate a virtual environment, install dependencies, and set your API key:
# From the repo root
python -m venv .venv # Or `uv venv`
source .venv/bin/activate
python -m pip install --upgrade pip # Or python -m ensurepip
pip install -r requirements.txt # Or `uv sync`
Windows (PowerShell)
Setup OpenAI API key
Required for all labs—do this even if you used the automated setup.
export OPENAI_API_KEY="sk-..."
export OPENAI_PROJECT_ID="proj_..."
export OPENAI_ORGANIZATION_ID="org_..."

# Optional: store in a local .env file for labs that use dotenv
echo "OPENAI_API_KEY=$OPENAI_API_KEY" > .env
echo "OPENAI_PROJECT_ID=$OPENAI_PROJECT_ID" >> .env
echo "OPENAI_ORGANIZATION_ID=$OPENAI_ORGANIZATION_ID" >> .env
Windows (PowerShell)
What you will learn
Evaluation design — define scoring rubrics with model-based graders and deterministic checks, and interpret pass/total.
Data discipline — use JSONL with a consistent {"item": {...}} shape for prompts and graders across labs.
Tooling fundamentals — validate inputs, raise precise errors, and keep outputs concise and deterministic.
Agent prompting patterns — ask for missing info, call one tool at a time, and summarize results clearly.
Agent composition — route between specialists and perform handoffs with explicit scopes and instructions.
Guardrails and safety — detect unsafe/off-topic inputs and trigger tripwires with structured outputs.
Retrieval and grounding (RAG) — build vector stores, retrieve high-signal context, and generate grounded answers.
Observability — use runners and dashboards to trace decisions, tool calls, and rubric outcomes.
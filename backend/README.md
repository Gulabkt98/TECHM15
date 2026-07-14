# ⚙️ LexGuard AI — Backend

FastAPI + LangGraph multi-agent backend for the Contract & SOW Risk Analyzer.
This document is the map of what exists, what each file does, and what is implemented vs. scaffolded.

**Status legend:** ✅ working · 🟡 partial (real code, needs wiring) · 🔲 interface + TODO (signature and docstring ready, logic pending)

---

## 📁 Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI app factory + router wiring
│   ├── config.py               # pydantic-settings — every env var, typed
│   ├── constants.py            # domain enums (single source of truth)
│   │
│   ├── api/                    # REST endpoints (/api/v1)
│   ├── agents/                 # LangGraph agents + supervisor + shared state
│   ├── workflows/              # upload / review / comparison / chat orchestration
│   ├── parser/                 # documents → clause registry
│   ├── graph/                  # Neo4j clause DAG + algorithms
│   ├── rag/                    # chunking, embeddings, hybrid retrieval
│   ├── risk_engine/            # deterministic playbook checkers
│   ├── compare/                # cross-document comparison
│   ├── reports/                # export formats
│   ├── llm/                    # Gemini adapter (only module that calls the LLM)
│   ├── db/                     # Postgres / Neo4j / Qdrant clients + ORM models
│   ├── schemas/                # Pydantic I/O contracts
│   ├── utils/                  # logger, validators, response envelope, hash chain
│   ├── tests/                  # pytest
│   └── data/                   # uploaded / processed / embeddings / reports
│
├── requirements.txt
├── .env.example
└── README.md                   # (this file)
```

---

## 🧱 Spine

| File | Purpose | Status |
|---|---|---|
| `app/main.py` | App factory (`create_app`), CORS, lifespan logging, registers all 9 routers under `/api/v1` | ✅ |
| `app/config.py` | `Settings` via pydantic-settings; modules never read `os.environ` directly | ✅ |
| `app/constants.py` | `DocumentType`, `DocumentStatus`, `EdgeType` (10 graph edge types), `Severity`, `FindingStatus`, `ClauseEvaluability`, `RiskCategory` | ✅ |

## 🌐 `api/` — REST endpoints

| File | Endpoints | Status |
|---|---|---|
| `health.py` | `GET /health` | ✅ |
| `upload.py` | `POST /upload` — validates PDF/DOCX + 50 MB limit, stores file, enqueues job | ✅ (storage) / 🟡 (queue) |
| `auth.py` | `POST /auth/login`, `POST /auth/refresh` | 🔲 |
| `contracts.py` | list, detail, clauses, `GET /{id}/gaps` (Evidence Gap Report) | 🔲 |
| `graph.py` | DAG export, `GET /{id}/cycles`, `GET /clause/{id}/effective` | 🔲 |
| `risk.py` | `POST /{id}/analyze`, findings list, `POST /findings/{id}/review` (HITL) | 🔲 |
| `compare.py` | `POST /msa-vs-sow`, `POST /versions` | 🔲 |
| `chat.py` | `POST /chat` — grounded Q&A, refuses instead of guessing | 🔲 |
| `reports.py` | PDF / JSON exports, `GET /{id}/audit` (hash-chained trail) | 🔲 |

Scaffolded endpoints return **HTTP 501**, never fake data — same ethos as the product.

## 🤖 `agents/` — LangGraph multi-agent pipeline

| File | Agent | Responsibility | Status |
|---|---|---|---|
| `supervisor.py` | 🎯 Supervisor | Builds the `StateGraph` topology: parse → graph → gate → risk → compliance → contradiction → citation → redline → report | ✅ (topology) |
| `state.py` | — | `ReviewState` TypedDict shared by every agent (incl. `raw_claims` vs `verified_findings` vs `rejected_claims`) | ✅ |
| `parser_agent.py` | 📄 Parser | Documents → clause registry (delegates to `app.parser`) | 🔲 |
| `graph_agent.py` | 🕸️ Knowledge Graph | Builds DAG, detects cycles, runs the **completeness gate** (scoped refusal) | 🔲 |
| `rag_agent.py` | 📚 RAG | Graph-scoped context packs for analysis agents | 🔲 |
| `risk_agent.py` | ⚠️ Risk Detection | Runs `risk_engine` checkers + LLM gap analysis → raw claims | 🔲 |
| `compliance_agent.py` | 📏 Compliance | Jurisdiction / required-clause / policy checks | 🔲 |
| `contradiction_agent.py` | ⚔️ Contradiction | Cross-document conflicts, precedence resolution | 🔲 |
| `citation_agent.py` | 📌 Citation | **Zero-hallucination grounding gate** — string-matches every quote to source; rejects what doesn't match | 🔲 |
| `redline_agent.py` | ✏️ Redline | Word-level diffs from playbook fallback templates | 🔲 |
| `report_agent.py` | 📊 Report | Assembles reviewer pack + honesty counters | 🔲 |

## 🔀 `workflows/`

| File | Purpose | Status |
|---|---|---|
| `upload_workflow.py` | Register document + enqueue parse→graph→gate job | 🟡 |
| `review_workflow.py` | Compiles + runs the supervisor pipeline (lazy import so the API never pays LangGraph cost) | ✅ (runner) |
| `comparison_workflow.py` | Targeted MSA↔SOW / version runs | 🔲 |
| `chat_workflow.py` | Retrieval → grounded answer or explicit refusal | 🔲 |

## 📄 `parser/`

| File | Purpose | Status |
|---|---|---|
| `pdf_parser.py` | PyMuPDF text with **char offsets + bboxes** (citation provenance) | 🔲 |
| `docx_parser.py` | python-docx → same page/offset model as PDF | 🔲 |
| `ocr.py` | Fallback for scanned pages; lowers extraction confidence | 🔲 |
| `section_parser.py` | Section-tree recovery (decimal / alpha / roman numbering) | 🔲 |
| `clause_extractor.py` | Clauses with stable refs + cross-refs, defined terms, obligations, "Exhibit B" mentions | 🔲 |
| `table_extractor.py` | Structure-preserving tables `{headers, rows, units}` | 🔲 |
| `metadata.py` | Title, parties, dates, governing document | 🔲 |

## 🕸️ `graph/`

| File | Purpose | Status |
|---|---|---|
| `graph_builder.py` | Persist clause nodes + typed edges to Neo4j | 🔲 |
| `neo4j.py` | `run_cypher()` helper over the shared driver | ✅ |
| `dependency.py` | `find_cycles` (SCC), `blast_radius` (missing-doc refusal), `effective_clause` (override resolution) | 🔲 |
| `queries.py` | Reusable Cypher: `BLAST_RADIUS`, `EXPORT_FAMILY_GRAPH` | ✅ |

## 📚 `rag/`

| File | Purpose | Status |
|---|---|---|
| `chunker.py` | **Clause-boundary** chunking (never mid-clause) | 🔲 |
| `embeddings.py` | Sentence-Transformers with lazy model load | ✅ |
| `vector_store.py` | Qdrant upsert with payload filters | 🔲 |
| `retriever.py` | Hybrid dense + BM25, graph-scoped | 🔲 |
| `reranker.py` | Cross-encoder re-ranking | 🔲 |
| `prompts.py` | `GROUNDING_RULES` — the mandatory-quote contract | ✅ |

## ⚠️ `risk_engine/` — deterministic checkers

| File | Checks | Status |
|---|---|---|
| `payment.py` | Duration normalisation ("Net 60" → days) vs playbook + MSA | 🔲 |
| `sla.py` | Penalty **tables** cross-validated against prose caps | 🔲 |
| `liability.py` | Effective cap after override chains; uncapped = walk-away | 🔲 |
| `ip.py` | IP vesting, pre-existing-materials carve-outs | 🔲 |
| `confidentiality.py` | Survival period, scope, NDA conflicts | 🔲 |
| `termination.py` | Convenience asymmetry, notice periods | 🔲 |
| `contradictions.py` | Deterministic numeric confirmation + precedence resolution | 🔲 |
| `scoring.py` | Severity from playbook tier — never from LLM vibes | 🔲 |

## ⚔️ `compare/` · 📊 `reports/` · 🧠 `llm/`

| File | Purpose | Status |
|---|---|---|
| `compare/msa_vs_sow.py` | Clause pairing + contradiction candidates | 🔲 |
| `compare/clause_compare.py` | Pairwise verdict: consistent / contradiction / needs-missing-doc | 🔲 |
| `compare/version_compare.py` | Amendment / version diff | 🔲 |
| `compare/similarity.py` | Cosine similarity for pairing | 🔲 |
| `reports/executive_summary.py` | Summary incl. honesty counters (generated/verified/rejected) | 🔲 |
| `reports/pdf.py` · `json_report.py` · `markdown.py` | Export formats | 🔲 |
| `llm/gemini.py` | **Only module that calls the LLM** — `generate_structured()` with JSON schema | 🔲 |
| `llm/prompts.py` | `CLASSIFY_CLAUSE`, `CONTRADICTION_CHECK` (grounding rules embedded) | ✅ |
| `llm/chains.py` | Composed call sequences | 🔲 |
| `llm/output_parser.py` | Drops claims missing quote/clause_ref before the grounding gate | ✅ |

## 🗄️ `db/` · `schemas/` · `utils/`

| File | Purpose | Status |
|---|---|---|
| `db/postgres.py` | Async SQLAlchemy engine/session, lazy init, `get_session()` DI | ✅ |
| `db/neo4j.py` | Async driver singleton | ✅ |
| `db/qdrant.py` | Client singleton + `CLAUSE_COLLECTION` | ✅ |
| `db/models.py` | ORM: `users`, `documents`, `clauses`, `findings`, `review_actions`, `audit_events` (hash-chained) | ✅ |
| `schemas/contract.py` | `DocumentOut`, `EvidenceGap`, `ContractFamilyOut` | ✅ |
| `schemas/clause.py` | `ClauseOut` (+ mandatory `Provenance`), `ClauseEdge`, `TableOut` | ✅ |
| `schemas/risk.py` | `FindingOut`, `Citation` (`verified` set only by the gate), `ReviewDecision` | ✅ |
| `schemas/report.py` | `ReportSummary` (honesty counters), `FullReport` | ✅ |
| `schemas/user.py` | Login / token / user | ✅ |
| `utils/logger.py` | Structured logging, one config point | ✅ |
| `utils/response.py` | Success envelope + honest `not_implemented` 501 | ✅ |
| `utils/helpers.py` | `new_id`, `sha256_hex`, `chain_hash` (audit ledger link) | ✅ |
| `utils/validators.py` | Extension + size validation | ✅ |
| `utils/file_utils.py` | Upload persistence (S3-swappable) | ✅ |
| `tests/test_health.py` | App-factory + health smoke test | ✅ |

---

## ▶️ Run

```bash
cd backend
python -m venv .venv && .venv\Scripts\activate     # Windows
pip install -r requirements.txt
copy .env.example .env                              # then fill in keys
uvicorn app.main:app --reload                       # → http://localhost:8000/docs
pytest app/tests                                    # smoke test
```

The API boots with **zero infrastructure** running — DB connections are lazy.

## 🧭 Implementation order (each step unlocks the next)

1. `parser/pdf_parser.py` → `section_parser.py` → `clause_extractor.py` — everything depends on the clause registry
2. `graph/graph_builder.py` + `dependency.py` — cycles + blast radius = the two demo wow-moments
3. `agents/citation_agent.py` — the grounding gate (deterministic, no LLM needed)
4. `llm/gemini.py` + `agents/risk_agent.py` + one `risk_engine` checker (start with `payment.py`)
5. `compare/msa_vs_sow.py` + `contradiction_agent.py`
6. `redline_agent.py` + reports

## 📐 Design rules (from `instructions.md`)

- **Layering:** `api` → `workflows` → `agents` → domain modules (`parser`/`graph`/`rag`/`risk_engine`/`compare`) → `db`. Never skip downward through two layers.
- `llm/gemini.py` is the **only** file that talks to the LLM API.
- Every extracted span carries provenance (`page`, `char_start`, `char_end`) — citations must be machine-verifiable.
- `Citation.verified` and `Finding.grounding_verified` are set **only** by the grounding gate.
- Severity comes from playbook rules; extraction confidence is reported separately and never blended in.
- Unimplemented = HTTP 501 or `NotImplementedError` — never a fake result.

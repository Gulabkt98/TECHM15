<div align="center">

<!-- ═══════════════════════ PROJECT BANNER ═══════════════════════ -->

<img src="docs/assets/banner.png" alt="LexGuard AI — Contract & SOW Risk Analyzer" width="100%" />

<!-- ═══════════════════════ LOGO ═══════════════════════ -->

<img src="docs/assets/logo.png" alt="LexGuard AI Logo" width="140" />

# ⚖️ LexGuard AI

### Enterprise Contract & SOW Risk Analyzer — Multi-Agent Legal Intelligence Platform

*Deterministic clause graphs · Cross-document contradiction detection · Evidence-grounded AI that refuses to guess*

<br/>

<!-- ═══════════════════════ BADGES ═══════════════════════ -->

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs&logoColor=white)
![LangGraph](https://img.shields.io/badge/LangGraph-Multi--Agent-1C3C3C?logo=langchain&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-2.5%20Pro-4285F4?logo=googlegemini&logoColor=white)
![Neo4j](https://img.shields.io/badge/Neo4j-Knowledge%20Graph-008CC1?logo=neo4j&logoColor=white)
![Qdrant](https://img.shields.io/badge/Qdrant-Vector%20DB-DC244C?logo=qdrant&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-Deployed-FF9900?logo=amazonwebservices&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)
![Hackathon](https://img.shields.io/badge/Tech%20Mahindra-CODE%20Hackathon-E31837)

<br/>

**[🚀 Quick Start](#-installation)** · **[🏗️ Architecture](#%EF%B8%8F-system-architecture)** · **[🤖 Agents](#-multi-agent-workflow)** · **[🔍 Explainability](#-explainable-ai)** · **[🗺️ Roadmap](#-future-scope)**

</div>

---

## 🎯 Elevator Pitch

**LexGuard AI is a contract analyst that proves every claim, maps every dependency as a graph, and refuses to guess.**

Enterprises sign thousands of contracts a year — MSAs, SOWs, NDAs, amendments — and every one of them is a web of cross-references, overrides, and incorporated exhibits. LexGuard AI parses that web into a **legal knowledge graph**, deploys **ten specialized AI agents** to detect risks and contradictions across the entire contract family, cites **exact clause, page, and evidence** for every finding, generates **word-level redlines** ready for negotiation, and — critically — **declines to evaluate anything it cannot verify**, reporting precisely which missing document blocks which clauses. Every AI decision flows through a **human-in-the-loop review workflow** with a tamper-evident audit trail.

> 🏆 Built for the **Tech Mahindra CODE Hackathon** (Mahindra University, Hyderabad) — Challenge 4: *Contract & SOW Risk Analyzer* — under the theme **"AI Delivered Right."**

---

## 📚 Table of Contents

- [Problem Statement](#-problem-statement)
- [Why Existing Solutions Fail](#-why-existing-solutions-fail)
- [Our Solution](#-our-solution)
- [Key Features](#-key-features)
- [End-to-End Workflow](#-end-to-end-workflow)
- [System Architecture](#%EF%B8%8F-system-architecture)
- [Multi-Agent Workflow](#-multi-agent-workflow)
- [RAG Pipeline](#-rag-pipeline)
- [Knowledge Graph Architecture](#-knowledge-graph-architecture)
- [Folder Structure](#-folder-structure)
- [Tech Stack](#-tech-stack)
- [Module Breakdown](#-module-breakdown)
- [Database Schema](#-database-schema)
- [API Architecture](#-api-architecture)
- [AI Pipeline](#-ai-pipeline)
- [Data Flow](#-data-flow)
- [Security Features](#-security-features)
- [Explainable AI](#-explainable-ai)
- [Human-in-the-Loop](#-human-in-the-loop)
- [Sample User Journey](#-sample-user-journey)
- [Sample Dashboard Screens](#-sample-dashboard-screens)
- [Future Scope](#-future-scope)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Project](#%EF%B8%8F-running-the-project)
- [Deployment](#-deployment)
- [Team Structure](#-team-structure)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgements](#-acknowledgements)

---

## 🧩 Problem Statement

Large enterprises process **thousands of legal agreements** — Master Service Agreements (MSAs), Statements of Work (SOWs), NDAs, vendor agreements, amendments, and compliance documents. Each contract is not an isolated document but a node in a legal hierarchy: an MSA governs its SOWs, amendments modify both, and exhibits are incorporated by reference. Reviewing them correctly requires reasoning across that entire structure.

Today, that reasoning is done manually — and it breaks down in predictable ways:

### 💸 The cost of manual review

| Pain Point | Real-World Consequence |
|---|---|
| ⏱️ **Slow** | A single MSA + SOW review takes a senior lawyer 4–8 hours; enterprise deal cycles stall for days |
| 💰 **Expensive** | Outside counsel review costs $300–$900/hour; in-house teams drown in low-value clause checking |
| 🐛 **Error-prone** | Fatigued reviewers miss cross-document conflicts — the #1 source of contract disputes |
| 📈 **Unscalable** | Contract volume grows ~20% YoY; legal headcount doesn't |

### 🔍 Concrete examples of what reviewers miss

1. **The hidden payment conflict.** The MSA says *"Customer shall pay all undisputed invoices within thirty (30) days."* Six months later, SOW #7's milestone table quietly specifies *"Net 60."* Which wins? The Order of Precedence clause in the MSA — which nobody re-read.
2. **The liability cap that isn't.** The MSA caps liability at *12 months of fees*, but SOW #3 attaches an SLA credit table whose penalties can accumulate to **25% of annual contract value** — silently breaching the cap.
3. **The override chain.** Clause 14.1 begins *"Notwithstanding Section 9.2…"* and carves data-breach claims out of the liability cap. A reviewer reading Section 9.2 in isolation reports the cap as airtight. It isn't.
4. **The circular reference.** Section 12.3 defers to Section 8.1, which is *"subject to Section 12.3."* The clause has no resolvable meaning — a drafting loop that survives three rounds of negotiation unnoticed.
5. **The missing exhibit.** The SOW incorporates *"the rates set forth in Exhibit B"* — but Exhibit B was never attached. A human either flags it or (worse) assumes; most AI tools simply **hallucinate a rate card**.

LexGuard AI is built to catch **all five** — with evidence, or with an explicit refusal.

---

## ❌ Why Existing Solutions Fail

The default "AI contract tool" in 2026 is **Upload PDF → Chat with it**. That architecture fails legal review at a structural level:

| # | Limitation of Chatbot-Based Analysis | Why It's Fatal for Contracts |
|---|---|---|
| 1 | 🌀 **Hallucinated citations** | LLMs invent section numbers and paraphrase clauses. In law, a wrong citation is worse than no answer. |
| 2 | 📄 **Single-document tunnel vision** | Chat sessions see one PDF. MSA↔SOW contradictions are *by definition* invisible. |
| 3 | 🕸️ **No structural understanding** | "Notwithstanding Section 9.2" is just tokens to a chatbot — not a directed override edge that changes what 9.2 *means*. |
| 4 | 🎲 **Confident answers on incomplete data** | Ask about fees when Exhibit B is missing and a chatbot **guesses**. The hackathon problem statement explicitly demands refusal instead. |
| 5 | 📊 **Tables flattened to mush** | Penalty grids, fee schedules, and SLA matrices lose their structure in text extraction — and their meaning with it. |
| 6 | 🧾 **No audit trail** | A chat log is not a compliance artifact. Regulated industries need *who saw what evidence and decided what, when*. |
| 7 | 🔁 **Not repeatable** | Same contract, same question, different answer on Tuesday. Legal risk assessment must be deterministic where determinism is possible. |
| 8 | 👤 **No human governance** | Suggestions go straight to users with no reviewer sign-off, no accept/reject workflow, no accountability. |

**The pattern:** chatbots treat contract review as a *language problem*. It is actually a **structured reasoning problem with a language layer** — dependency resolution, graph traversal, constraint checking, and evidence verification, with an LLM only where genuine language understanding is required.

---

## 💡 Our Solution

LexGuard AI is a **hybrid neuro-symbolic platform**: deterministic engineering where trust is required, AI where language understanding adds value, and humans where judgment matters.

### The five pillars

| Pillar | What It Means |
|---|---|
| 🕸️ **Legal Knowledge Graph** | Every clause becomes a node in Neo4j; every reference, override, condition, and incorporation becomes a **typed, directed edge**. Dependency questions become graph algorithms — cycle detection is Tarjan's SCC, not an LLM opinion. |
| 🤖 **Multi-Agent Orchestration** | Ten specialized agents (parser, clause intelligence, risk, compliance, comparison, citation, redline, report…) coordinated by a **Supervisor Agent** via LangGraph — each agent narrow, testable, and auditable. |
| 🛡️ **Zero-Hallucination Grounding Gate** | Every AI claim must carry an **exact source quote with character offsets**. A deterministic verifier string-matches each quote against the original document. Unverified claims are **rejected and logged** — never shown. |
| 🚫 **Blast-Radius Refusal** | When a referenced exhibit is missing, the graph computes exactly which clauses transitively depend on it. Those clauses are marked `UNEVALUABLE` with an Evidence Gap Report; everything else is analyzed normally. Refusal is **scoped, explained, and reversible** — upload the exhibit and the blocked findings evaluate instantly. |
| 👩‍⚖️ **Human-in-the-Loop Governance** | Every finding and redline enters a reviewer queue (accept / modify / reject with reasons), recorded in a **hash-chained, tamper-evident audit ledger**. |

### What "different" looks like in practice

| Dimension | Typical AI Contract Tool | 🛡️ LexGuard AI |
|---|---|---|
| Dependencies | Mentioned in prose | Typed DAG with algorithms (SCC, topological sort, transitive closure) |
| "Notwithstanding X" | Ignored | Override edges + **effective-clause resolution** |
| Missing exhibits | Hallucinated assumptions | Scoped refusal + blast radius + gap report |
| Contradictions | Same-document only | **Cross-document**, precedence-aware |
| Tables | Flattened or displayed | Structured + **cross-validated against prose** |
| Redlines | "Consider revising…" | **Word-level diff** + native DOCX tracked changes |
| Citations | "See Section 9" | Clause path + page + highlighted, **string-verified** quote |
| Trust model | "Trust the AI" | Grounding gate with a visible rejection counter |
| Governance | None | Reviewer workflow + hash-chained audit trail |

---

## ✨ Key Features

### 🧱 Core Features

- 📥 **Multi-format ingestion** — PDF and DOCX upload for entire *contract families* (MSA + SOWs + amendments + exhibits), linked hierarchically
- 🧾 **Structural parsing** — section trees, clause registry with stable IDs (`MSA §9.2.1`), obligations, defined terms, cross-references, and **structure-preserving table extraction**
- 🕸️ **Clause dependency DAG** — `REFERENCES`, `OVERRIDES`, `SUBORDINATE_TO`, `CONDITIONS_ON`, `INCORPORATES`, `DEFINES/USES_TERM`, `AMENDS` edges
- 🔁 **Real-time circular-reference detection** — flags drafting loops the moment a document is parsed, with the full loop path and a suggested break point
- ⚔️ **Cross-document contradiction engine** — aligns SOW terms against governing MSA constraints, resolves conflicts via the Order of Precedence clause
- ✏️ **Word-level redlines** — precise insertions/deletions from a configurable fallback-language library, exportable as **native Word tracked changes**
- 📌 **Visual source citation** — every finding links to exact clause, page, and section hierarchy, highlighted in the embedded PDF viewer

### 🤖 AI Features

- 🧠 **Ten-agent LangGraph orchestration** with a Supervisor Agent routing work and enforcing quality gates
- 🛡️ **Grounding verifier** — deterministic post-check that rejects any AI output whose quoted evidence doesn't string-match the source
- 📚 **Hybrid RAG** — Qdrant dense vectors + BM25 sparse retrieval + cross-encoder re-ranking, scoped by graph neighborhood
- 🏷️ **Clause classification** across 41+ risk categories (validated against the CUAD expert-annotated dataset)
- 🎯 **Dual confidence model** — *extraction confidence* ("did we read it right?") reported separately from *risk severity* ("how bad is it?"), never conflated
- 🔍 **Effective-clause resolver** — computes what a clause *actually means* after every override and precedence rule is applied
- 📊 **Table-vs-prose cross-validation** — catches penalty tables that breach liability caps stated in text

### 🏢 Enterprise Features

- 📋 **Playbook-as-Code** — legal playbooks as versioned YAML with `preferred / fallback / walk-away` position tiers; swap playbooks per client without touching code
- 🔗 **Hash-chained audit ledger** — every AI suggestion and human decision appended to a tamper-evident log (SHA-256 chained), exportable as a signed review report
- 👥 **RBAC** — Admin / Legal Reviewer / Analyst / Viewer roles with per-workspace isolation
- 🔐 **Encryption** at rest (S3 SSE, Postgres) and in transit (TLS 1.3)
- ⚙️ **Async processing at scale** — Celery + Redis job pipeline; a 200-page contract family analyzes in minutes, not hours
- 📈 **Operational dashboard** — portfolio-level risk posture across all contract families

### 🔮 Future Features

- 🤝 Negotiation simulation (counterparty-response prediction on proposed redlines)
- 🌐 Multi-language contract support (EU / APAC vendor paper)
- 🔌 CLM integrations (Icertis, SirionLabs, Ironclad) and DMS connectors (SharePoint, iManage)
- 🧬 Fine-tuned clause classifier distilled from LLM labels — 10× cheaper inference
- 📅 Obligation calendar with renewal/termination deadline alerts

---

## 🔄 End-to-End Workflow

```mermaid
flowchart TD
    A["📤 Upload Contract Family<br/>MSA + SOWs + Exhibits"] --> B["🧾 Parse & Structure<br/>clauses, tables, refs, obligations"]
    B --> C["🕸️ Build Clause Dependency Graph<br/>Neo4j typed edges"]
    C --> D{"🔁 Circular<br/>references?"}
    D -- "Yes" --> D1["🚨 Flag drafting loops<br/>+ suggested break point"]
    D -- "No" --> E
    D1 --> E{"📂 Completeness Gate<br/>all referenced exhibits present?"}
    E -- "Missing docs" --> E1["🚫 Blast-Radius Refusal<br/>mark dependent clauses UNEVALUABLE<br/>+ Evidence Gap Report"]
    E -- "Complete" --> F
    E1 --> F["🧠 Multi-Agent Analysis<br/>risk, compliance, comparison"]
    F --> G["🛡️ Grounding Verifier<br/>string-match every quote to source"]
    G -- "Unverified claim" --> G1["🗑️ Reject & log claim"]
    G -- "Verified" --> H["✏️ Redline Generation<br/>word-level diff from playbook"]
    G1 --> H
    H --> I["👩‍⚖️ Human Review Queue<br/>accept / modify / reject"]
    I --> J["📜 Hash-Chained Audit Trail"]
    J --> K["📊 Export<br/>DOCX tracked changes · PDF report · JSON"]
```

---

## 🏗️ System Architecture

```mermaid
flowchart TB
    subgraph CLIENT["🖥️ Frontend — Next.js 15"]
        UI["React + Tailwind + shadcn/ui"]
        FLOW["React Flow<br/>Clause Graph Explorer"]
        PDFV["pdf.js Viewer<br/>citation highlighting"]
    end

    subgraph API["⚙️ Backend — FastAPI"]
        REST["REST API + WebSocket<br/>progress streaming"]
        AUTH["Auth + RBAC<br/>JWT"]
        ORCH["Analysis Orchestrator"]
    end

    subgraph WORKERS["🔧 Async Workers — Celery"]
        PARSE["Parsing Pipeline"]
        AGENTS["LangGraph<br/>Multi-Agent Runtime"]
        VERIFY["Grounding Verifier"]
        EXPORT["Report / DOCX Exporter"]
    end

    subgraph AI["🧠 AI Layer"]
        LLM["Gemini 2.5 Pro<br/>structured JSON outputs"]
        EMB["Sentence Transformers<br/>embeddings"]
    end

    subgraph DATA["🗄️ Data Layer"]
        PG[("PostgreSQL<br/>findings · audit · users")]
        NEO[("Neo4j<br/>legal knowledge graph")]
        QD[("Qdrant<br/>clause vectors")]
        S3[("AWS S3<br/>original documents")]
        REDIS[("Redis<br/>queue + cache")]
    end

    CLIENT <--> REST
    REST --> AUTH
    REST --> ORCH
    ORCH --> REDIS
    REDIS --> WORKERS
    PARSE --> S3
    PARSE --> PG
    PARSE --> NEO
    PARSE --> QD
    AGENTS <--> LLM
    AGENTS <--> NEO
    AGENTS <--> QD
    AGENTS --> VERIFY
    VERIFY --> PG
    EMB --> QD
    EXPORT --> S3
    EXPORT --> PG
```

**Design decisions worth noting:**

- **FastAPI ⇄ Celery split** — parsing and agent runs are long-lived; the API stays responsive and streams progress over WebSocket.
- **Neo4j for the graph, not Postgres recursion** — override chains and blast-radius queries are multi-hop traversals; Cypher expresses them in one line.
- **Qdrant scoped by graph neighborhood** — retrieval is filtered to the relevant contract family and clause subgraph, slashing irrelevant context.
- **The LLM is stateless and replaceable** — all state lives in Postgres/Neo4j; Gemini 2.5 Pro is called through a thin adapter, so swapping models is a config change.

---

## 🤖 Multi-Agent Workflow

Ten specialized agents, coordinated by a **Supervisor Agent** on LangGraph. Each agent has one job, a typed I/O contract, and its outputs pass through the grounding verifier before persistence.

```mermaid
flowchart TD
    SUP["🎯 Supervisor Agent<br/>routing · retries · quality gates"]

    SUP --> P["📄 Parser Agent<br/>layout, sections, tables"]
    P --> CI["🏷️ Clause Intelligence Agent<br/>classification · obligations · defined terms"]
    CI --> KG["🕸️ Knowledge Graph Agent<br/>typed edges · cycle detection · effective clauses"]
    KG --> GATE{"📂 Completeness<br/>Gate"}
    GATE -- "gaps found" --> REFUSE["🚫 Evidence Gap Report<br/>scoped refusal"]
    GATE -- "proceed" --> RISK
    REFUSE --> RISK["⚠️ Risk Detection Agent<br/>playbook rule evaluation"]
    RISK --> COMP["📏 Compliance Agent<br/>regulatory + policy checks"]
    KG --> CMP["⚔️ Contract Comparison Agent<br/>MSA ↔ SOW ↔ amendments"]
    CMP --> RISK
    RISK --> CITE["📌 Citation Agent<br/>quote extraction + grounding check"]
    COMP --> CITE
    CITE --> RED["✏️ Redline Suggestion Agent<br/>word-level fallback language"]
    RED --> REP["📊 Report Generation Agent<br/>review pack · DOCX · JSON"]
    REP --> SUP
```

| Agent | Responsibility | Key Techniques |
|---|---|---|
| 🎯 **Supervisor** | Routes tasks, enforces retries and output-schema validation, halts pipeline on gate failures | LangGraph state machine |
| 📄 **Parser** | PDF/DOCX → section tree, clause registry, tables, char-offset provenance | PyMuPDF, pdfplumber, layout heuristics |
| 🏷️ **Clause Intelligence** | Clause-type classification (41+ categories), obligation & defined-term extraction | Gemini structured outputs, CUAD-validated |
| 🕸️ **Knowledge Graph** | Builds typed edges, detects cycles, resolves override chains into effective clauses | Neo4j, Tarjan SCC, topological sort |
| ⚠️ **Risk Detection** | Evaluates every clause against the active YAML playbook | Rule engine + LLM gap analysis |
| 📏 **Compliance** | Checks jurisdiction, data-protection, and policy constraints | Playbook compliance rules |
| ⚔️ **Contract Comparison** | Pairs comparable clauses across documents; finds hidden contradictions | Semantic alignment + deterministic numeric checks |
| 📌 **Citation** | Attaches exact quotes, page numbers, section paths; runs the grounding gate | String verification against source offsets |
| ✏️ **Redline Suggestion** | Word-level insert/delete diffs using playbook fallback templates | diff-match-patch, OOXML tracked changes |
| 📊 **Report Generation** | Assembles the reviewer pack, exports, and audit entries | python-docx, PDF renderer |

---

## 📚 RAG Pipeline

Retrieval is **graph-scoped and verified** — the LLM never sees unanchored text, and never emits unanchored claims.

```mermaid
flowchart LR
    subgraph INGEST["📥 Indexing"]
        DOC["Parsed clauses<br/>+ tables + metadata"] --> CHUNK["Clause-boundary chunking<br/>never mid-clause"]
        CHUNK --> EMBED["Sentence Transformers<br/>dense embeddings"]
        EMBED --> QDR[("Qdrant<br/>vectors + payload filters")]
        CHUNK --> BM25["BM25 sparse index"]
    end

    subgraph QUERY["🔍 Retrieval"]
        Q["Agent query<br/>e.g. liability cap terms"] --> SCOPE["Graph scoping<br/>Neo4j neighborhood filter"]
        SCOPE --> HYBRID["Hybrid search<br/>dense + sparse fusion"]
        QDR --> HYBRID
        BM25 --> HYBRID
        HYBRID --> RERANK["Cross-encoder<br/>re-ranking"]
        RERANK --> CTX["Context pack<br/>clause text + IDs + offsets"]
    end

    CTX --> LLM["🧠 Gemini 2.5 Pro<br/>structured output + mandatory quotes"]
    LLM --> GV{"🛡️ Grounding<br/>Verifier"}
    GV -- "quote matches source" --> OUT["✅ Verified finding"]
    GV -- "no match" --> REJ["🗑️ Rejected + logged"]
```

**Why clause-boundary chunking matters:** naive fixed-size chunking splits clauses mid-sentence, destroying legal meaning and making citations impossible. LexGuard chunks **on the clause registry**, so every retrieved chunk maps 1:1 to a citable clause ID with char offsets.

---

## 🕸️ Knowledge Graph Architecture

The Neo4j graph is the platform's reasoning substrate — dependency questions become Cypher traversals.

```mermaid
graph TD
    MSA["📘 Document: MSA"] -- "GOVERNS" --> SOW["📗 Document: SOW #1"]
    MSA -- "GOVERNS" --> SOW2["📗 Document: SOW #2"]
    AMD["📙 Document: Amendment 1"] -- "AMENDS" --> MSA

    SOW -- "HAS_CLAUSE" --> C1["§3.2 Payment Terms<br/>Net 60"]
    MSA -- "HAS_CLAUSE" --> C2["§5.1 Payment Terms<br/>Net 30"]
    MSA -- "HAS_CLAUSE" --> C3["§9.2 Liability Cap<br/>12 months fees"]
    MSA -- "HAS_CLAUSE" --> C4["§14.1 Data Breach Indemnity"]
    MSA -- "HAS_CLAUSE" --> C5["§2.4 Order of Precedence"]
    SOW -- "HAS_CLAUSE" --> C6["§7.1 SLA Credits"]
    SOW -- "HAS_CLAUSE" --> C7["§4.4 Rates"]

    C4 -- "OVERRIDES<br/>(Notwithstanding §9.2)" --> C3
    C1 -- "CONTRADICTS ⚡" --> C2
    C5 -- "RESOLVES" --> C1
    C6 -- "CONSTRAINED_BY" --> C3
    C7 -- "INCORPORATES" --> EXB["📎 Exhibit B: Rate Card<br/>⛔ MISSING"]
    C6 -- "HAS_TABLE" --> T1["📊 SLA Penalty Table"]
```

### Node types

| Node | Properties |
|---|---|
| `Document` | type (MSA/SOW/NDA/Amendment/Exhibit), title, version, upload status, S3 key |
| `Clause` | stable ID, section path, text, char offsets, page, clause type, extraction confidence |
| `Table` | structured JSON (headers/rows/units), page, parent clause |
| `Obligation` | party, action, deadline, trigger condition |
| `DefinedTerm` | term, definition, defining clause |
| `ExternalRef` | referenced document name, resolution status (present / **missing**) |

### Edge types

| Edge | Meaning | Powers Which Feature |
|---|---|---|
| `REFERENCES` | "as described in Section 4.2" | Citation navigation |
| `OVERRIDES` | "Notwithstanding Section X" | Effective-clause resolution |
| `SUBORDINATE_TO` | "Subject to Section X" | Precedence solving |
| `CONDITIONS_ON` | "If Customer terminates under §11…" | Conditional risk paths |
| `INCORPORATES` | "as set forth in Exhibit B" | **Blast-radius refusal** |
| `CONTRADICTS` | Detected cross-document conflict | Contradiction engine |
| `GOVERNS / AMENDS` | Document hierarchy | Cross-document alignment |

**Signature query — blast radius of a missing exhibit:**

```cypher
MATCH (e:ExternalRef {status: 'missing'})<-[:INCORPORATES]-(c:Clause)
MATCH (dep:Clause)-[:REFERENCES|CONDITIONS_ON*0..5]->(c)
RETURN e.name AS missing_doc, collect(DISTINCT dep.clause_id) AS blocked_clauses
```

---

## 📁 Folder Structure

```
lexguard-ai/
├── 📂 frontend/                      # Next.js 15 application
│   ├── app/
│   │   ├── (auth)/                   # Login, workspace selection
│   │   ├── dashboard/                # Portfolio risk overview
│   │   ├── contracts/[familyId]/     # Contract family workspace
│   │   │   ├── findings/             # Risk board + review queue
│   │   │   ├── graph/                # React Flow clause explorer
│   │   │   ├── viewer/               # pdf.js with citation highlights
│   │   │   └── redlines/             # Redline editor + DOCX export
│   │   └── audit/                    # Audit trail browser
│   ├── components/                   # shadcn/ui composition
│   ├── lib/                          # API client, websocket hooks
│   └── styles/
│
├── 📂 backend/                       # FastAPI + Celery
│   ├── app/
│   │   ├── api/                      # REST routes (v1)
│   │   ├── core/                     # config, security, RBAC
│   │   ├── models/                   # SQLAlchemy ORM
│   │   ├── schemas/                  # Pydantic I/O contracts
│   │   ├── services/
│   │   │   ├── parsing/              # PDF/DOCX → clause registry
│   │   │   ├── graph/                # Neo4j builder, SCC, blast radius
│   │   │   ├── retrieval/            # Qdrant + BM25 hybrid RAG
│   │   │   ├── playbook/             # YAML rule engine
│   │   │   ├── grounding/            # quote verification gate
│   │   │   ├── redline/              # diff + OOXML tracked changes
│   │   │   └── audit/                # hash-chained ledger
│   │   ├── agents/                   # LangGraph agent definitions
│   │   │   ├── supervisor.py
│   │   │   ├── parser_agent.py
│   │   │   ├── clause_intelligence.py
│   │   │   ├── knowledge_graph.py
│   │   │   ├── risk_detection.py
│   │   │   ├── compliance.py
│   │   │   ├── comparison.py
│   │   │   ├── citation.py
│   │   │   ├── redline_agent.py
│   │   │   └── report_agent.py
│   │   └── workers/                  # Celery task definitions
│   ├── playbooks/                    # YAML legal playbooks
│   │   └── default_enterprise.yaml
│   └── tests/
│
├── 📂 data/                          # (gitignored) CUAD, LexGLUE, ContractNLI
├── 📂 docs/                          # Architecture docs, analysis, assets
│   └── CHALLENGE-4-ANALYSIS.md
├── 📂 infra/
│   ├── docker-compose.yml            # Full local stack
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── aws/                          # ECS task defs, Terraform
├── .env.example
├── LICENSE
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology | Role |
|---|---|---|
| 🖥️ **Frontend** | Next.js 15 · React 19 | App framework, server components |
| 🎨 **UI** | Tailwind CSS · shadcn/ui | Design system |
| 🕸️ **Graph UI** | React Flow | Interactive clause DAG explorer |
| 📄 **Doc Viewer** | pdf.js | Citation highlighting on source pages |
| ⚙️ **API** | FastAPI (Python 3.11) | REST + WebSocket backend |
| 🔧 **Async Jobs** | Celery + Redis | Parsing & agent pipelines |
| 🧠 **LLM** | Gemini 2.5 Pro | Clause understanding, contradiction candidates |
| 🤖 **Orchestration** | LangGraph + LangChain | Supervisor multi-agent state machine |
| 🔤 **Embeddings** | Sentence Transformers | Dense clause vectors |
| 📚 **Vector DB** | Qdrant | Hybrid semantic retrieval |
| 🕸️ **Knowledge Graph** | Neo4j 5 | Clause dependency DAG + Cypher reasoning |
| 🗄️ **Database** | PostgreSQL 16 | Findings, users, playbooks, audit ledger |
| 📦 **Storage** | AWS S3 | Original documents, exports |
| 🚢 **Deployment** | Docker Compose · AWS ECS | Local dev & cloud production |

---

## 🧩 Module Breakdown

### Backend modules

| Module | What It Does |
|---|---|
| `services/parsing` | Converts PDF/DOCX into the clause registry: section-numbering recovery (decimal, alpha, Roman), table extraction with structure preserved, char-offset provenance for every span. The foundation every other module builds on. |
| `services/graph` | Builds the Neo4j graph from parsed clauses; runs Tarjan SCC for circular references; computes effective clauses by walking override chains in topological order; answers blast-radius queries for the completeness gate. |
| `services/retrieval` | Clause-boundary chunking, dense + sparse indexing, graph-scoped hybrid search with cross-encoder re-ranking. Returns context packs with clause IDs and offsets, never raw text. |
| `services/playbook` | Loads versioned YAML playbooks; evaluates preferred/fallback/walk-away positions per clause type; deterministic numeric guards (payment days, cap multiples, notice periods). |
| `services/grounding` | The trust kernel: string-matches every LLM-quoted span against source offsets; rejects and logs unverifiable claims; maintains the verification counter surfaced in the UI. |
| `services/redline` | Word-level diff between original clause text and instantiated fallback templates; renders GitHub-style diffs for the UI and native `w:ins`/`w:del` OOXML for Word export. |
| `services/audit` | Append-only event ledger; each event embeds the SHA-256 of its predecessor; exports signed PDF review reports. |
| `agents/*` | LangGraph node definitions per agent with typed state, retry policy, and schema-validated outputs. |
| `api/` | Versioned REST routes, WebSocket progress channel, JWT auth, RBAC dependency injection. |
| `workers/` | Celery tasks wrapping the pipeline stages so long analyses never block the API. |

### Frontend modules

| Module | What It Does |
|---|---|
| `dashboard/` | Portfolio view: risk posture per contract family, findings by severity, evidence-gap alerts, verification-rate widget. |
| `contracts/[familyId]/findings` | The risk board — severity-ranked finding cards with clause path, quote, confidence, playbook rule; the reviewer accept/modify/reject queue. |
| `contracts/[familyId]/graph` | React Flow clause explorer: override edges in red, incorporations dashed, cycles pulsing, missing-document nodes ghosted; click any node for clause detail. |
| `contracts/[familyId]/viewer` | pdf.js source viewer; clicking any citation scrolls to the page and highlights the exact verified span. |
| `contracts/[familyId]/redlines` | Side-by-side redline editor with word-level diff rendering and one-click DOCX tracked-changes export. |
| `audit/` | Chronological, filterable audit trail with hash-chain integrity indicator. |
| `lib/` | Typed API client, WebSocket hooks for live pipeline progress, auth/session management. |

---

## 🗄️ Database Schema

```mermaid
erDiagram
    USERS ||--o{ WORKSPACES : owns
    WORKSPACES ||--o{ CONTRACT_FAMILIES : contains
    CONTRACT_FAMILIES ||--o{ DOCUMENTS : includes
    DOCUMENTS ||--o{ CLAUSES : has
    CLAUSES ||--o{ FINDINGS : triggers
    FINDINGS ||--o{ REDLINES : proposes
    FINDINGS ||--o{ REVIEW_ACTIONS : receives
    CONTRACT_FAMILIES ||--o{ EVIDENCE_GAPS : reports
    CONTRACT_FAMILIES ||--o{ AUDIT_EVENTS : logs
    PLAYBOOKS ||--o{ FINDINGS : evaluates

    USERS {
        uuid id PK
        string email
        string role "admin | reviewer | analyst | viewer"
    }
    DOCUMENTS {
        uuid id PK
        string doc_type "MSA | SOW | NDA | AMENDMENT | EXHIBIT"
        string s3_key
        string status "parsed | gated | analyzed"
    }
    CLAUSES {
        uuid id PK
        string clause_ref "e.g. MSA-9.2.1"
        text body
        int page
        int char_start
        int char_end
        float extraction_confidence
    }
    FINDINGS {
        uuid id PK
        string severity "critical | high | medium | low"
        string category
        text evidence_quote
        bool grounding_verified
        float confidence
        string status "open | accepted | modified | rejected"
    }
    REDLINES {
        uuid id PK
        jsonb word_diff
        text fallback_source
    }
    REVIEW_ACTIONS {
        uuid id PK
        uuid reviewer_id FK
        string action "accept | modify | reject"
        text reason
        timestamptz created_at
    }
    EVIDENCE_GAPS {
        uuid id PK
        string missing_document
        jsonb blocked_clause_ids
        bool resolved
    }
    AUDIT_EVENTS {
        uuid id PK
        string event_type
        jsonb payload
        string prev_hash
        string event_hash "SHA-256 chain"
    }
    PLAYBOOKS {
        uuid id PK
        string name
        int version
        jsonb rules_yaml
    }
```

**Key tables explained:**

- **`clauses`** — the canonical clause registry; `char_start/char_end` make every citation machine-verifiable.
- **`findings`** — one row per flagged risk; `grounding_verified` is set only by the verifier service, never by an agent.
- **`evidence_gaps`** — the refusal record: which missing document blocks which clause IDs; flips to `resolved` when the exhibit is uploaded.
- **`audit_events`** — hash-chained ledger; `event_hash = SHA256(prev_hash + payload)` makes tampering detectable.

*(The clause dependency edges themselves live in Neo4j; Postgres stores relational/workflow state.)*

---

## 🔌 API Architecture

RESTful, versioned under `/api/v1`, JWT-authenticated, with WebSocket progress streaming.

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/v1/auth/login` | Issue JWT |
| `POST` | `/api/v1/families` | Create a contract family (MSA + children) |
| `POST` | `/api/v1/families/{id}/documents` | Upload PDF/DOCX (multipart → S3) |
| `POST` | `/api/v1/families/{id}/analyze` | Kick off the full agent pipeline |
| `WS` | `/api/v1/families/{id}/progress` | Live pipeline stage updates |
| `GET` | `/api/v1/families/{id}/findings` | Severity-ranked findings with citations |
| `GET` | `/api/v1/families/{id}/graph` | Clause DAG (nodes + typed edges) for React Flow |
| `GET` | `/api/v1/families/{id}/gaps` | Evidence Gap Report (missing docs + blast radius) |
| `GET` | `/api/v1/clauses/{id}/effective` | Effective clause after overrides |
| `POST` | `/api/v1/findings/{id}/review` | Reviewer decision: accept / modify / reject |
| `GET` | `/api/v1/findings/{id}/redline` | Word-level diff JSON |
| `GET` | `/api/v1/families/{id}/export/docx` | Word file with native tracked changes |
| `GET` | `/api/v1/families/{id}/export/report` | Signed PDF review report |
| `GET` | `/api/v1/families/{id}/audit` | Hash-chained audit trail |
| `GET` | `/api/v1/playbooks` · `POST /playbooks` | List / upload YAML playbooks |

**Conventions:** cursor pagination on list endpoints, `problem+json` error bodies, idempotency keys on uploads, and every mutating endpoint writes an audit event.

---

## 🧠 AI Pipeline

The eight stages every contract family passes through:

### 1. 📄 Document Parsing
PyMuPDF + pdfplumber extract text **with layout**: page numbers, bounding boxes, char offsets. Deterministic heuristics recover the section tree across numbering schemes (`1.`, `1.1`, `(a)`, `(i)`). Tables are extracted as structured `{headers, rows, units}` JSON — never flattened.

### 2. ✂️ Chunking
Chunks follow **clause boundaries** from the registry — never fixed token windows. Each chunk carries `clause_ref`, `page`, and `char offsets` as Qdrant payload, so retrieval results are citable by construction.

### 3. 🔤 Embedding
Sentence Transformers encode each clause chunk; vectors upsert to Qdrant with payload filters (family ID, document type, clause type). A BM25 sparse index is built in parallel for exact-term matching (defined terms, section numbers).

### 4. 🔍 Retrieval
Hybrid dense + sparse search, fused and re-ranked by a cross-encoder, **pre-filtered by graph neighborhood** — when analyzing §9.2, retrieval is scoped to §9.2's dependency subgraph plus comparable clauses in sibling documents.

### 5. 🧮 Reasoning
LangGraph agents call Gemini 2.5 Pro with strict JSON schemas: clause classification, obligation extraction, contradiction candidates. Numeric claims (days, percentages, amounts) are normalized to canonical units and **re-verified deterministically in code** — the LLM proposes, the rule engine confirms.

### 6. ⚖️ Decision
The playbook engine renders verdicts: `compliant` / `fallback-needed` / `walk-away` / `unevaluable`. Every verdict bundles the rule that fired, the verified evidence quote, extraction confidence, and severity. Claims failing the grounding gate never reach this stage.

### 7. ✏️ Redline
For `fallback-needed` findings, the playbook's fallback template is instantiated with this contract's parameters (party names, amounts) and diffed word-by-word against the original — producing precise insertions/deletions, rendered in-app and exported as native Word tracked changes.

### 8. 📊 Report Generation
The report agent assembles the reviewer pack: executive risk summary, findings by severity, contradiction matrix, evidence-gap report, redline appendix, and the audit-chain digest — exportable as PDF and JSON.

---

## 🔀 Data Flow

```mermaid
sequenceDiagram
    actor U as 👤 Analyst
    participant FE as 🖥️ Next.js
    participant API as ⚙️ FastAPI
    participant W as 🔧 Celery Workers
    participant KG as 🕸️ Neo4j
    participant VDB as 📚 Qdrant
    participant LLM as 🧠 Gemini 2.5 Pro
    participant PG as 🗄️ Postgres

    U->>FE: Upload MSA + SOW + exhibits
    FE->>API: POST /families/{id}/documents
    API->>W: enqueue parse job
    W->>W: parse → clause registry + tables
    W->>KG: build typed clause graph
    W->>KG: run cycle detection (Tarjan SCC)
    W->>KG: completeness gate → blast radius
    KG-->>API: evidence gaps (if any)
    API-->>FE: 🚫 Evidence Gap Report (WebSocket)
    W->>VDB: index clause chunks
    W->>LLM: classify · compare · assess (scoped context)
    LLM-->>W: structured claims + exact quotes
    W->>W: 🛡️ grounding verifier (string-match)
    W->>PG: persist verified findings + rejected-claim log
    W->>PG: append hash-chained audit events
    API-->>FE: findings ready (WebSocket)
    U->>FE: review → accept / modify / reject
    FE->>API: POST /findings/{id}/review
    API->>PG: record decision + audit event
    U->>FE: export
    API-->>U: 📄 DOCX tracked changes + signed PDF report
```

**Step-by-step:** upload → parse → graph build → cycle check → completeness gate (refusal if gaps) → index → agent analysis → grounding verification → persistence → human review → export. Every arrow that changes state also writes an audit event.

---

## 🔐 Security Features

| Control | Implementation |
|---|---|
| 🔑 **Authentication** | JWT access + refresh tokens; bcrypt password hashing; optional SSO (OIDC) for enterprise deployments |
| 👥 **RBAC** | Four roles — **Admin** (workspace + playbook management), **Legal Reviewer** (approve/reject findings), **Analyst** (upload + run analysis), **Viewer** (read-only). Enforced via FastAPI dependencies on every route |
| 🧱 **Workspace isolation** | Every query is tenant-scoped; contract families are invisible across workspaces |
| 🔒 **Encryption in transit** | TLS 1.3 everywhere; WebSocket over WSS |
| 🗝️ **Encryption at rest** | S3 server-side encryption (SSE-S3/KMS); encrypted Postgres volumes; Qdrant/Neo4j on encrypted storage |
| 📜 **Audit logging** | Hash-chained, append-only event ledger covering uploads, AI claims (accepted *and* rejected), reviewer actions, and exports — the chain digest exposes any tampering |
| 🧹 **Data hygiene** | Documents purgeable per family; no contract text is used for model training; LLM calls carry only scoped context, never whole repositories |

---

## 🔍 Explainable AI

Explainability in LexGuard is **enforced by architecture**, not requested by prompt.

### Confidence — two scores, never blended

| Score | Question It Answers | Produced By |
|---|---|---|
| 🎯 **Extraction confidence** | "How sure are we that we read the clause correctly?" | Parser + classifier agreement, layout quality signals |
| ⚠️ **Risk severity** | "How bad is this term under the playbook?" | Deterministic playbook rules |

A blurry scan yields *low extraction confidence* and routes to human verification — it is never disguised as "medium risk."

### Evidence & citations

Every finding carries a citation object:

```json
{
  "finding": "SOW payment terms contradict MSA",
  "severity": "high",
  "rule": "playbook.payment_terms.max_days=30",
  "evidence": [
    { "doc": "MSA", "clause": "5.1", "page": 12, "quote": "within thirty (30) days", "verified": true },
    { "doc": "SOW-1", "clause": "3.2", "page": 4, "quote": "Net 60 from invoice date", "verified": true }
  ],
  "resolution": "MSA prevails per Order of Precedence §2.4",
  "extraction_confidence": 0.97
}
```

The `verified: true` flag is set **only** by the grounding service after string-matching the quote at the recorded offsets. The dashboard shows the honesty metric in real time: **"142 claims generated · 139 verified · 3 rejected as ungrounded."** The rejected ones are logged, not hidden.

---

## 👩‍⚖️ Human-in-the-Loop

AI proposes; humans dispose. Nothing leaves the platform without reviewer sign-off.

```mermaid
stateDiagram-v2
    [*] --> Open : Finding created (verified)
    Open --> UnderReview : Reviewer opens finding
    UnderReview --> Accepted : ✅ Accept redline
    UnderReview --> Modified : ✏️ Edit then accept
    UnderReview --> Rejected : ❌ Reject (reason required)
    Accepted --> Exported : Included in DOCX / report
    Modified --> Exported
    Rejected --> [*] : Logged with rationale
    Exported --> [*] : Audit chain sealed
```

- Reviewers work a **severity-sorted queue**; each card shows the clause, evidence, playbook rule, confidence, and proposed redline side-by-side with the original.
- **Modify** opens the redline editor — reviewer edits become the exported language, attributed to the reviewer in the audit trail.
- **Reject requires a reason**, which is stored and (future scope) mined to tune playbook rules.
- Low-extraction-confidence clauses are **force-routed** to review even if no rule fired.

---

## 🚶 Sample User Journey

```
📤 Upload Contract Family          "MSA_TechCorp.pdf + SOW_1.pdf" dropped into a new family
        ↓
🧠 AI Processing                   Live pipeline: Parsed ✓ → Graph ✓ → Gate ⚠️
                                   "Exhibit B (Rate Card) missing — 7 clauses unevaluable"
        ↓
⚠️ Risk Detection                  14 findings ranked: 2 critical (cap breach via SLA table,
                                   payment-terms contradiction), 5 high, 7 medium
        ↓
👩‍⚖️ Lawyer Review                  Reviewer accepts 11 redlines, modifies 2, rejects 1 with reason;
                                   uploads Exhibit B → 7 blocked clauses evaluate instantly
        ↓
📄 Export Report                   DOCX with native tracked changes + signed PDF review pack
                                   + hash-chain digest for compliance archive
```

---

## 🖥️ Sample Dashboard Screens

| Screen | What You See |
|---|---|
| 📊 **Portfolio Dashboard** | Risk posture cards per contract family; severity donut; evidence-gap alerts; the live grounding-verification counter; recent reviewer activity |
| ⚠️ **Risk Board** | Severity-sorted finding cards — clause path, verified quote, playbook rule, dual confidence chips; filters by document, category, status |
| 🕸️ **Clause Graph Explorer** | React Flow DAG — override edges red, incorporations dashed, detected cycles pulsing, missing-exhibit nodes ghosted; click-through to clause detail |
| 📄 **Source Viewer** | Split view: finding on the left, pdf.js on the right auto-scrolled to the cited page with the exact span highlighted |
| ✏️ **Redline Editor** | Word-level diff (insertions green, deletions red strikethrough), fallback-source note, accept/modify/reject bar, DOCX export button |
| 🚫 **Evidence Gap Report** | Missing documents list, blocked-clause blast radius, upload drop-zone that re-triggers evaluation on resolution |
| 📜 **Audit Trail** | Filterable chronological ledger with chain-integrity badge and one-click signed-report export |

---

## 🔮 Future Scope

- 🤝 **Negotiation simulator** — predict counterparty responses to proposed redlines; suggest concession strategy
- 📅 **Obligation calendar** — extracted deadlines/renewals as a subscribed calendar with alerts
- 🌐 **Multi-language support** — EU/APAC vendor paper via multilingual embeddings
- 🔌 **Ecosystem integrations** — Icertis, SirionLabs, Ironclad CLM; SharePoint/iManage DMS; Slack/Teams review notifications
- 🧬 **Distilled clause classifier** — fine-tuned small model from LLM-labeled data; 10× cheaper, fully offline-capable
- 📊 **Portfolio analytics** — clause benchmark statistics across the whole contract estate ("73% of our SOWs exceed playbook payment terms")
- 🏛️ **Regulatory packs** — jurisdiction-specific compliance playbooks (DPDP, GDPR, RBI outsourcing norms)

---

## 🚀 Installation

### Prerequisites

- Node.js ≥ 20 · pnpm ≥ 9
- Python ≥ 3.11 · [uv](https://github.com/astral-sh/uv) (or pip)
- Docker ≥ 24 + Docker Compose
- A Gemini API key

### 1️⃣ Clone

```bash
git clone https://github.com/Gulabkt98/TECHM15.git lexguard-ai
cd lexguard-ai
cp .env.example .env        # fill in your keys (see below)
```

### 2️⃣ Backend

```bash
cd backend
uv venv && source .venv/bin/activate      # Windows: .venv\Scripts\activate
uv pip install -r requirements.txt
alembic upgrade head                       # apply Postgres migrations
```

### 3️⃣ Frontend

```bash
cd frontend
pnpm install
```

### 4️⃣ Infrastructure (Postgres · Redis · Qdrant · Neo4j · MinIO-S3)

```bash
docker compose -f infra/docker-compose.yml up -d postgres redis qdrant neo4j minio
```

---

## 🔧 Environment Variables

`.env.example`:

```env
# ── Application ────────────────────────────────────────────
APP_ENV=development
SECRET_KEY=change-me-to-a-long-random-string
API_BASE_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

# ── AI ─────────────────────────────────────────────────────
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-pro
EMBEDDING_MODEL=sentence-transformers/all-mpnet-base-v2

# ── Databases ──────────────────────────────────────────────
DATABASE_URL=postgresql+asyncpg://lexguard:lexguard@localhost:5432/lexguard
REDIS_URL=redis://localhost:6379/0
QDRANT_URL=http://localhost:6333
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=change-me

# ── Storage (MinIO locally, S3 in prod) ────────────────────
S3_ENDPOINT_URL=http://localhost:9000
S3_BUCKET=lexguard-documents
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
AWS_REGION=ap-south-1

# ── Auth ───────────────────────────────────────────────────
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

> ⚠️ Never commit a real `.env` — only `.env.example` is tracked.

---

## ▶️ Running the Project

**Terminal 1 — API:**

```bash
cd backend && uvicorn app.main:app --reload --port 8000
```

**Terminal 2 — Workers:**

```bash
cd backend && celery -A app.workers worker --loglevel=info
```

**Terminal 3 — Frontend:**

```bash
cd frontend && pnpm dev
```

Open **http://localhost:3000** → log in → create a contract family → upload the sample documents in `docs/samples/` → watch the pipeline run.

**Or run everything with one command:**

```bash
docker compose -f infra/docker-compose.yml up --build
```

---

## ☁️ Deployment

### Docker (any host)

```bash
docker compose -f infra/docker-compose.yml --profile production up -d --build
```

Images are multi-stage (slim Python + standalone Next.js output) and configured via environment only — no baked secrets.

### AWS (reference architecture)

| Component | AWS Service |
|---|---|
| Frontend | Vercel or S3 + CloudFront |
| API + Workers | ECS Fargate (separate services, shared task role) |
| Queue/Cache | ElastiCache Redis |
| Database | RDS PostgreSQL 16 (encrypted) |
| Vector DB | Qdrant on ECS/EC2 (EBS-backed) |
| Knowledge Graph | Neo4j Aura or self-hosted EC2 |
| Storage | S3 with SSE-KMS + lifecycle policies |
| Secrets | AWS Secrets Manager |
| Observability | CloudWatch logs + metrics; structured JSON logging |

---

## 👥 Team Structure

| Member | GitHub | Role |
|---|---|---|
| Gulab Ram | [@Gulabkt98](https://github.com/Gulabkt98) | AI Engineering · Multi-Agent Pipeline · Knowledge Graph |
| Raghav | [@raghav-1411](https://github.com/raghav-1411) | Backend · API · Infrastructure |
| *Member 3* | — | Frontend · UX · Graph Visualization |
| *Member 4* | — | Data · Evaluation (CUAD) · Pitch |

---

## 🤝 Contributing

1. Fork the repo and create a feature branch: `git checkout -b feat/your-feature`
2. Follow conventional commits (`feat:`, `fix:`, `docs:`…)
3. Run checks before pushing: `pytest` (backend) · `pnpm lint && pnpm typecheck` (frontend)
4. Open a PR with a clear description — screenshots for UI changes, sample output for pipeline changes

Please keep the golden rule of this codebase: **no AI claim ships without a verified citation.**

---

## 📄 License

Distributed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgements

- 🏆 **Tech Mahindra CODE Hackathon** & **Mahindra University, Hyderabad** — for the problem statement and platform
- 📚 **[CUAD](https://www.atticusprojectai.org/cuad)** (Atticus Project) — 510 expert-annotated contracts used to validate clause extraction
- 📖 **LexGLUE / LEDGAR** — contract-provision classification benchmark
- 🤝 **ContractNLI** — evidence-grounded entailment/contradiction dataset that inspired our contradiction-engine output format
- 🛠️ The open-source ecosystem: FastAPI, LangGraph, Qdrant, Neo4j, React Flow, pdf.js, and Sentence Transformers

<div align="center">

**⚖️ LexGuard AI — because in legal review, *"probably right"* is wrong.**

*Built with conviction for AI Delivered Right.*

</div>

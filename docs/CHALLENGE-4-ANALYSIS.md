# Challenge 4 — Contract & SOW Risk Analyzer
### Deep analysis, build plan, and differentiating features
*Tech Mahindra CODE Hackathon · Mahindra University, Hyderabad · Theme: "AI Delivered Right"*

---

## 1. Executive summary

Challenge 4 asks for a **contract review system** that analyzes legal agreements (MSAs, SOWs, exhibits) against a **configurable legal playbook**. Three phrases in the problem statement tell you what the judges actually want, and they rule out the obvious build:

1. **"Map legal dependencies mathematically"** — they want a real graph data structure (a DAG) with deterministic algorithms on it, not an LLM summarizing a PDF.
2. **"Resolve cross-document contradictions"** — the system must reason *across* documents (SOW vs. governing MSA), not review one file at a time.
3. **"Explicitly refuse to evaluate incomplete data rather than generating unverified assumptions"** — they are explicitly testing for **anti-hallucination engineering**. A system that confidently answers everything will *lose* to one that knows when to say "I can't evaluate this, and here is exactly why."

This is the hardest of the four challenges, and the one where a "ChatGPT wrapper" is most obviously insufficient — which is exactly why it's the best one to win with. The winning strategy is a **hybrid architecture**: deterministic parsing, graph algorithms, and verification where trust is required; LLM intelligence only where language understanding is genuinely needed. That hybrid *is* the theme — "AI Delivered Right" means AI used where it adds value, and engineering rigor everywhere else.

**One-line pitch:** *"A contract analyst that proves every claim, maps every dependency as a graph, and refuses to guess."*

---

## 2. Domain primer (know these terms before you demo)

Judges from Tech Mahindra live in this world — using the vocabulary correctly earns credibility.

| Term | What it is | Why it matters here |
|---|---|---|
| **MSA** (Master Services Agreement) | The umbrella contract setting the legal ground rules: liability, indemnity, IP, termination, payment terms | The "constitution" — SOWs must comply with it |
| **SOW** (Statement of Work) | A child document under the MSA defining a specific project: scope, deliverables, milestones, fees | Where hidden contradictions with the MSA live |
| **Exhibit / Schedule / Annex** | Attachments incorporated by reference ("as set forth in Exhibit B") | If missing, clauses that depend on them are **unevaluable** — this is the refusal test |
| **Order of Precedence clause** | A clause stating which document wins on conflict ("the MSA shall prevail over any SOW…") | The rulebook for resolving cross-document contradictions |
| **"Notwithstanding Section X"** | Override language: this clause wins over Section X even if X says otherwise | Creates *override edges* in the dependency graph |
| **"Subject to Section X"** | The reverse: this clause is subordinate to X | Creates *subordination edges* |
| **Incorporation by reference** | Text of another document is legally "pulled into" this one | Creates *external dependency edges* — and refusal triggers when the target is absent |
| **Defined terms** | Capitalized terms ("Services", "Deliverables") defined once and used everywhere | A term defined differently in MSA vs. SOW is a classic hidden contradiction |
| **Redline** | Tracked-changes edit showing exact insertions/deletions proposed on contract text | Required output — at *word level*, not paragraph level |
| **Playbook** | A company's internal rulebook: preferred positions, acceptable fallbacks, walk-away terms per clause type | Must be **configurable**, not hardcoded |
| **LD / Liquidated damages, SLA credits** | Penalty amounts usually specified in tables | Why "preserve table structures" is a requirement |

---

## 3. Requirement-by-requirement breakdown

The problem statement lists 9 build requirements. For each: what it really means, how to build it, and the pitfall that will sink most teams.

### R1 — Parse contracts into clauses, sections, references, obligations, tables, external dependencies

**What it means.** Convert PDF/DOCX into a *structured model*: a hierarchy of sections → clauses, each with an ID (e.g. `9.2.1`), text, page number, plus extracted entities: internal cross-references ("Section 4.3"), obligations ("Supplier shall…"), tables, and references to external documents ("Exhibit B", "the DPA").

**How to build.**
- Deterministic layer first: PyMuPDF/pdfplumber (or Docling) for text + layout; regex/heuristics for numbering schemes (`1.`, `1.1`, `(a)`, `(i)`, Roman numerals) to recover the section tree.
- LLM layer second: clause classification (limitation of liability, indemnity, termination…), obligation extraction (who / must do what / by when / triggered by what), with **structured JSON output** and mandatory source quotes.
- Every extracted object carries provenance: `{doc, page, section_path, char_start, char_end, exact_quote}`.

**Pitfall.** Teams that feed the whole PDF to an LLM and ask "find the risks" get no clause IDs, no page numbers, no citations — and fail R7 (visual source citation) automatically. Structure first, semantics second.

### R2 — Clause dependency graph (DAG) resolving nested conditions and "Notwithstanding Section X"

**What it means.** The heart of the system. Nodes = clauses. Typed, directed edges:

| Edge type | Example trigger text |
|---|---|
| `REFERENCES` | "as described in Section 4.2" |
| `OVERRIDES` | "Notwithstanding Section 9.2…" |
| `SUBORDINATE_TO` | "Subject to Section 3.1…" |
| `CONDITIONS_ON` | "If Customer terminates under Section 11…" |
| `INCORPORATES` | "as set forth in Exhibit B" |
| `DEFINES / USES_TERM` | Defined term declared vs. consumed |
| `AMENDS` | "Section 5 of the MSA is amended as follows…" |

**How to build.** `networkx` DiGraph. Edge extraction is mostly deterministic (these phrases are formulaic); LLM assists on ambiguous phrasing. To answer "what does clause 9.2 *effectively* say?", walk the override chain in topological order and compute the **effective clause** — base text plus every override that applies, with the precedence rules from the Order of Precedence clause deciding ties.

**Pitfall.** Building the graph and never *using* it. The graph must visibly drive answers in the demo: "9.2 caps liability at 12 months of fees, **but** 14.1 overrides it for data-breach claims — here's the override path."

### R3 — Detect circular references and drafting loops in real time

**What it means.** "Section 12.3 as qualified by Section 8.1" + "Section 8.1 subject to Section 12.3" = a drafting loop with no resolvable meaning. Detect it the moment the graph is built.

**How to build.** Cycle detection on the directed graph — Tarjan's strongly-connected-components algorithm (built into networkx, runs in linear time). Report every SCC of size > 1: the clauses involved, the edge texts that create the loop, **and a suggested break point** (which edge to sever, with proposed redline language). "Real time" = run on upload and on every what-if edit, surfacing instantly in the UI.

**Pitfall.** Only detecting 2-node loops. Plant a 3-node cycle (A→B→C→A) in your demo document and catch it — judges may test exactly this.

### R4 — Align SOW requirements against governing MSA constraints; find hidden contradictions

**What it means.** Cross-document reasoning. Examples of *hidden* contradictions (not word-for-word conflicts):
- MSA: payment net-30 → SOW milestone table: net-60.
- MSA: liability cap = 12 months' fees → SOW: uncapped LDs that can exceed the cap.
- MSA: IP vests in Customer → SOW: "pre-existing tools remain Supplier property" applied to new deliverables.
- MSA defines "Deliverables" one way → SOW silently redefines it.

**How to build.** Pair comparable clauses across documents (same clause-type classification from R1 + defined-term links), then run an LLM contradiction check per pair with a strict output contract: verdict (consistent / contradiction / needs-missing-doc), severity, both exact quotes, and which document *should* prevail per the Order of Precedence clause. Numeric comparisons (days, percentages, amounts) are verified deterministically after extraction — the LLM finds candidates, code confirms the numbers.

**Pitfall.** Naive text similarity. "Net 30" vs "sixty (60) days" won't string-match — normalize numbers and durations into canonical units before comparing.

### R5 — Preserve table structures (penalties, fees, milestones, service levels)

**What it means.** A penalty grid flattened to prose loses its meaning. Tables must survive as tables — extracted with rows/columns/headers intact, rendered as tables in the UI, and *used* in analysis.

**How to build.** pdfplumber/Camelot (or Docling's table model) → structured JSON `{headers, rows, units}`. Then the differentiator: **cross-validate tables against prose**. If the SLA table implies penalties up to 25% of fees but the prose caps LDs at 10%, that's a flagged contradiction with both citations.

**Pitfall.** Extracting tables and only *displaying* them. The points are in reasoning over them.

### R6 — Precise redlines with word-level insertions and deletions for fallback language

**What it means.** Not "consider changing this clause" — an exact edit: strike *these words*, insert *those words*, where the inserted language comes from the playbook's fallback library.

**How to build.** `diff-match-patch` (or word-tokenized LCS diff) between original clause text and the playbook's fallback template filled with this contract's parameters. Render GitHub-style: red strikethrough deletions, green insertions. **Killer feature:** export as a real `.docx` with native tracked changes (`w:ins`/`w:del` elements via python-docx / OOXML) — the reviewer opens it in Microsoft Word and sees genuine tracked changes, ready to send to a counterparty.

**Pitfall.** Paragraph-level "replace the whole clause" suggestions. The requirement says *word-level* — build a real diff.

### R7 — Visual source citation: exact clause, page, section hierarchy, evidence per flagged risk

**What it means.** Every risk card shows: document → section path (`MSA › 9 Liability › 9.2 Cap`) → page number → the exact quoted text, ideally highlighted on the rendered page.

**How to build.** Provenance was captured in R1 (char offsets + page + bbox from PyMuPDF). UI: click a citation → PDF viewer scrolls to the page and highlights the span (pdf.js supports this). Because every claim carries `char_start/char_end`, citations are *verifiable by code*, not decorative.

**Pitfall.** Citations the system can't actually locate ("see Section 9" with no page/quote). If you can't highlight it, you haven't cited it.

### R8 — Refuse to evaluate when referenced documents/exhibits are missing

**What it means.** The anti-hallucination requirement — the most unusual and most heavily weighted item. If the SOW incorporates Exhibit B (rate card) and Exhibit B wasn't uploaded, the system must **decline** to evaluate fee-related risks — *specifically and partially*, not by refusing the whole contract.

**How to build.** A **completeness gate** before analysis:
1. From R2's `INCORPORATES` edges, list every referenced external document.
2. Match against the uploaded set (fuzzy title matching: "Exhibit B", "the Rate Card", "Attachment 2").
3. For each missing document, compute the **blast radius**: all clauses transitively dependent on it via the graph.
4. Those clauses get status `UNEVALUABLE — missing evidence`, with an **Evidence Gap Report**: what's missing, which clauses it blocks, what *would* be evaluated once supplied.
5. Everything outside the blast radius is analyzed normally.

**Pitfall (both directions).** Refusing everything (useless) or refusing nothing (fails the requirement). Graph-scoped partial refusal is the sophisticated middle — and no other team is likely to have it.

### R9 — Complete audit trail: original text, risk rating, AI suggestions, human reviewer decisions

**What it means.** Legal-grade traceability. For every finding: the original text, the rule that fired, the AI's suggestion and confidence, and what the human reviewer did (accept / modify / reject, by whom, when, why).

**How to build.** Append-only `audit_events` table; every state change is an event. Reviewer workflow in the UI: findings queue → accept / edit / reject with a mandatory note on reject. **Differentiator:** hash-chain the log (each event stores the SHA-256 of the previous event) → tamper-evident, blockchain-style integrity without blockchain theater. One-click export of the full trail as a PDF review report.

**Pitfall.** Logging AI actions but not human ones. The requirement explicitly includes *reviewer decisions* — human-in-the-loop is part of "AI Delivered Right."

---

## 4. System architecture

```
                        ┌─────────────────────────────────────────────┐
                        │                REVIEWER UI (React)          │
                        │  Risk board · Clause graph · PDF viewer     │
                        │  Redline editor · Evidence gaps · Audit log │
                        └──────────────────────┬──────────────────────┘
                                               │ REST/WebSocket
┌──────────────┐   ┌───────────────────────────┴────────────────────────────┐
│  PLAYBOOK    │   │                  ORCHESTRATOR (FastAPI)                │
│  (YAML DSL)  ├──▶│  pipeline state machine · per-contract job queue       │
└──────────────┘   └──┬──────────┬──────────┬──────────┬──────────┬─────────┘
                      ▼          ▼          ▼          ▼          ▼
                ┌─────────┐┌──────────┐┌─────────┐┌─────────┐┌──────────┐
                │ 1 PARSE ││ 2 GRAPH  ││ 3 GATE  ││ 4 ANALYZE││ 5 REDLINE│
                │ layout, ││ DAG build││ missing ││ playbook ││ word-diff│
                │ clauses,││ cycles,  ││ exhibits││ rules +  ││ + DOCX   │
                │ tables, ││ overrides││ blast   ││ MSA↔SOW  ││ tracked  │
                │ refs    ││ effective││ radius  ││ contra-  ││ changes  │
                │         ││ clauses  ││ REFUSAL ││ dictions ││          │
                └────┬────┘└────┬─────┘└────┬────┘└────┬─────┘└────┬─────┘
                     │          │           │          │           │
                     ▼          ▼           ▼          ▼           ▼
              ┌────────────────────────────────────────────────────────┐
              │  POSTGRES: documents · clauses · edges · tables ·      │
              │  findings · evidence gaps · hash-chained audit_events  │
              └────────────────────────────────────────────────────────┘

  LLM (Claude API) is called ONLY inside stages 1 & 4, always with:
  structured JSON output + mandatory exact quotes → verified by the
  GROUNDING VERIFIER (string-match against source; unverified = dropped)
```

**Decision flow per contract:** Parse → Build graph → Detect cycles → **Completeness gate (refuse what can't be evaluated)** → Effective-clause resolution → Playbook rule evaluation + cross-doc contradiction detection → Grounding verification of every finding → Redline generation → Human review → Audit export.

### Technology stack

| Layer | Choice | Why |
|---|---|---|
| Parsing | PyMuPDF + pdfplumber (or Docling) | Layout, char offsets, tables, page bboxes |
| Graph | networkx | DAG, Tarjan SCC, topological sort, descendants() for blast radius |
| LLM | Claude API (structured outputs, low temperature) | Clause classification, obligation extraction, contradiction candidates |
| Backend | Python + FastAPI | Fast to build, async pipeline, WebSocket progress |
| Store | PostgreSQL (JSONB) — or SQLite for the demo | Findings, provenance, audit chain |
| Diff | diff-match-patch / word-level LCS | R6 word-level redlines |
| DOCX export | python-docx + raw OOXML `w:ins`/`w:del` | Real tracked changes in Word |
| Frontend | React + Tailwind | Speed |
| Graph viz | React Flow or Cytoscape.js | Interactive clause DAG |
| PDF viewer | pdf.js | Scroll-to + highlight citations |

---

## 5. Core features (baseline — maps 1:1 to the 9 requirements)

1. Multi-format ingestion (PDF/DOCX) of MSA + SOWs + exhibits as a linked *contract family*.
2. Structural parser → section tree, clause registry with IDs, provenance on every span.
3. Typed clause dependency DAG with override/subordination/incorporation edges.
4. Real-time circular-reference detector with loop explanation and suggested break.
5. Effective-clause resolver (what a clause means *after* all overrides and precedence).
6. Cross-document contradiction engine (SOW ↔ MSA ↔ exhibits) with severity ranking.
7. Table extraction + table-aware risk analysis (penalties, fees, milestones, SLAs).
8. Playbook engine — configurable rules, no code changes needed.
9. Word-level redline generator with fallback language.
10. Visual citations: clause path + page + highlighted quote for every finding.
11. Completeness gate with explicit, scoped refusal.
12. Reviewer workflow (accept/modify/reject) + complete audit trail.

---

## 6. Advanced differentiator features — what makes yours different

These are ranked by **wow-per-hour**: judge impact relative to build effort. The first five are the ones to lead with in the pitch.

### ⭐ 6.1 Zero-Hallucination Grounding Gate
Every LLM output must include the exact source quote with character offsets. A deterministic verifier string-matches each quote against the actual document; **any claim that fails verification is discarded and logged**, never shown. Show the counter in the UI: *"142 claims generated, 139 verified, 3 rejected as ungrounded."* No other team will show the judges their AI being *caught and corrected* by code — this is "AI Delivered Right" made literal.

### ⭐ 6.2 Blast-Radius Refusal (Evidence Gap Report)
Refusal isn't binary. When Exhibit B is missing, the graph computes exactly which clauses are unevaluable (transitive dependents of the `INCORPORATES` edge) and the system refuses *only those*, with a report: **"7 clauses blocked by 1 missing document — upload the Rate Card to unlock fee analysis."** Upload the exhibit live in the demo and watch the blocked findings evaluate in real time. This turns the "refuse" requirement — which most teams will treat as an error message — into the demo's best moment.

### ⭐ 6.3 Effective-Clause Resolver with Precedence Lattice
Parses the Order of Precedence clause into machine-readable ranking, combines it with `OVERRIDES`/`SUBORDINATE_TO` edges, and renders any clause as it *actually operates*: base text + strikethroughs where overridden + the winning language, with the override chain shown as a path in the graph. This is "map legal dependencies mathematically" delivered visibly.

### ⭐ 6.4 True Word Tracked-Changes Export
Findings export as a `.docx` that opens in Microsoft Word with **native tracked changes** (author: "AI Reviewer"), ready for a real negotiation. Every other team will show colored text in a browser; you hand the judge a Word file their legal department could actually send out.

### ⭐ 6.5 Table Integrity Cross-Check
Tables aren't just preserved — they're audited against prose. Demo case: SLA credit table allows penalties up to 25% of monthly fees while clause 9.4 caps total credits at 10% → flagged with both citations. Nobody else will reason *between* a table and a sentence.

### 6.6 Playbook-as-Code (YAML DSL)
The playbook is a versioned YAML file: per-clause-type rules with **three position tiers** — `preferred` / `fallback` (with template language for redlines) / `walk_away` — plus numeric guards (`max_liability_cap_months: 12`, `min_payment_days: 30`). Swap the playbook file, rerun, get different findings live: proof of "configurable" in ten seconds.

```yaml
- rule: liability_cap
  clause_types: [limitation_of_liability]
  preferred:  { cap: "12 months fees", carveouts_allowed: [fraud, IP_infringement] }
  fallback:   { cap: "24 months fees", template: "fallbacks/liability_cap_24m.txt" }
  walk_away:  { uncapped: true }
  severity_if_walk_away: CRITICAL
```

### 6.7 What-If Propagation
Edit a clause (or accept a redline) → only the affected subgraph re-evaluates → risks flip from red to green live. Shows the DAG isn't a diagram, it's the computation.

### 6.8 Defined-Terms Conflict Detector
Builds a symbol table of every defined term per document; flags terms redefined inconsistently across MSA/SOW and terms used but never defined. Cheap to build (near-deterministic), and it catches the sneakiest class of real-world contract bugs.

### 6.9 Hash-Chained Audit Ledger
Each audit event embeds the SHA-256 of the previous event — tamper-evident review history, exportable as a signed PDF report. One line of crypto, big compliance story.

### 6.10 Dual Confidence Model
Two separate scores, never conflated: **extraction confidence** ("how sure are we we read the clause correctly") and **risk severity** ("how bad is this term under the playbook"). Low extraction confidence routes to human verification instead of pretending certainty — honest AI, on theme.

### 6.11 Obligation Calendar (stretch)
Every extracted obligation (party, action, deadline, trigger) plotted on a timeline — "what do we owe and when" across the whole contract family.

### 6.12 Interactive Clause Constellation (stretch, high demo value)
Full-screen React Flow view of the DAG: overrides in red, incorporations dashed, cycles pulsing, missing-document nodes ghosted. Click any node → clause text + findings. This is the screenshot that goes on the pitch deck cover.

---

## 7. What most teams will build vs. what you build

| Dimension | Typical team | Your build |
|---|---|---|
| Core approach | Prompt an LLM: "find risks in this contract" | Deterministic structure + graph + verified LLM findings |
| Dependencies | Mentioned in text output | Typed DAG with algorithms (SCC, topo sort, descendants) |
| "Notwithstanding" | Ignored or paraphrased | Override edges + effective-clause resolution |
| Missing exhibits | Hallucinated assumptions, or a generic error | Scoped refusal + blast radius + evidence gap report |
| Contradictions | Same-document only | Cross-document with precedence-aware resolution |
| Tables | Flattened to text or displayed only | Structured + cross-validated against prose |
| Redlines | "Consider revising this clause" | Word-level diff + native Word tracked changes |
| Citations | "See Section 9" | Clause path + page + highlighted verified quote |
| Trust | "Trust the AI" | Grounding gate: unverified claims rejected, counter shown |
| Audit | Chat history | Hash-chained ledger incl. human decisions |

---

## 8. Demo script (5 minutes) and seeded test documents

**Prepare one synthetic contract family** (author it yourselves so every trap is planted deliberately):
- `MSA_TechCorp.pdf` — 15–20 pages: net-30 payment, 12-month liability cap, an Order of Precedence clause, defined terms, a "Notwithstanding Section 9.2" override in the indemnity section, and a planted 3-clause circular reference.
- `SOW_1.pdf` — net-60 in the milestone table (contradiction), an SLA penalty table breaching the cap (table-vs-prose conflict), redefines "Deliverables" (defined-term conflict), incorporates **Exhibit B** by reference.
- `Exhibit_B.pdf` — the rate card. **Deliberately not uploaded at first.**

**The script:**
1. *(30s)* Upload MSA + SOW. Pipeline stages animate: Parsed → Graph → Gate.
2. *(45s)* **Refusal moment:** Evidence Gap Report appears — "Exhibit B missing; 7 clauses unevaluable." Say the line: *"It refuses to guess — that's the point."*
3. *(45s)* Risk board: ranked findings, each with clause path, page, highlighted quote. Click one → PDF scrolls and highlights.
4. *(45s)* Open the clause graph: show the override chain and the pulsing circular reference, with the suggested break.
5. *(45s)* Cross-document contradiction: net-30 vs net-60, MSA prevails per precedence clause; then the table-vs-prose SLA breach.
6. *(45s)* Accept a redline → word-level diff → **export DOCX → open in Word with real tracked changes.**
7. *(30s)* Upload Exhibit B live → blocked clauses evaluate, gap report clears.
8. *(15s)* Flash the audit trail + grounding counter ("139/142 claims verified"). Close on theme.

---

## 9. Test data sources

- **Author your own MSA + SOW family** (above) — mandatory, it's your controlled demo.
- **CUAD** (Contract Understanding Atticus Dataset) — 500+ real contracts with 13k expert clause annotations across 41 categories; use for validating clause classification.
- SEC EDGAR material-contract exhibits (real MSAs/SOWs, public domain) for robustness testing.
- Keep an "unseen" contract ready in case judges hand you their own PDF — graceful degradation (partial parse + honest confidence) beats a crash.

---

## 10. Pitch-deck mapping ("AI Delivered Right", 8–10 slides)

1. **Problem** — $100B+ contract review market; a missed cap or hidden SOW contradiction costs real money; reviews take days and reviewers hallucinate too (fatigue).
2. **Why current AI fails here** — hallucinated citations, no cross-document reasoning, confident answers on incomplete data. Legal has the *lowest* hallucination tolerance of any domain.
3. **Solution** — the hybrid: deterministic graph + verified AI + human sign-off. One architecture slide (Section 4 diagram).
4. **Live-demo highlights** — refusal, graph, tracked changes (screenshots as backup).
5. **Uniqueness** — the table from Section 7, condensed to 5 rows.
6. **"AI Delivered Right" alignment** — grounding gate (AI is verified), scoped refusal (AI is honest), audit chain + human-in-the-loop (AI is accountable), playbook DSL (AI is governable). This slide writes itself; no other challenge maps to the theme this cleanly.
7. **Architecture & stack** — pipeline + where the LLM is and *isn't* used.
8. **Roadmap** — clause-library learning from reviewer decisions; multi-contract portfolio risk; negotiation simulation (counterparty-response prediction); CLM integrations (Icertis, SirionLabs — both big in the TechM ecosystem); fine-tuned clause classifier to cut LLM cost 10×.

---

## 11. Hackathon build plan (two people can split cleanly)

| Phase | Hours | Deliverable |
|---|---|---|
| 1. Parser + clause registry + provenance | 0–6 | Sections, clauses, tables, refs extracted from your seeded docs |
| 2. Graph build + cycle detection + completeness gate | 6–12 | DAG, SCC report, evidence-gap report working end-to-end |
| 3. Playbook engine + cross-doc contradictions + grounding verifier | 12–20 | Ranked, cited, verified findings |
| 4. UI: risk board, PDF highlight, graph view | 14–26 *(parallel)* | Demo-ready front end |
| 5. Redlines + DOCX tracked changes + audit trail + reviewer flow | 20–30 | Full loop: finding → redline → human decision → export |
| 6. Demo hardening + pitch deck + README | 30–36 | Rehearsed 5-min script, seeded docs, repo with setup instructions |

**Scope discipline:** if time collapses, cut 6.11 and 6.12 first, then What-If (6.7). Never cut the refusal gate (R8/6.2) or citations (R7/6.1) — they're the requirements that decide the winner.

**Cost note:** with deterministic parsing doing the heavy lifting, LLM calls are limited to classification + contradiction checks — a full contract family analyzes for well under a dollar. Cheap enough to re-run live on stage.

---

## 12. Risks and mitigations

| Risk | Mitigation |
|---|---|
| PDF parsing breaks on judges' documents | Demo on your seeded family; accept DOCX too; degrade gracefully with per-clause extraction confidence |
| LLM latency during live demo | Cache pipeline results; only the live Exhibit-B upload runs fresh (small doc, fast) |
| Numbering scheme edge cases (Roman, (a)(i), mixed) | Support the 3 common schemes; flag unparsed regions honestly instead of guessing |
| Over-refusal makes the tool look useless | Blast-radius scoping guarantees everything *outside* the gap is fully analyzed |
| Team unfamiliar with legal nuance | The playbook DSL encodes the legal knowledge once; Section 2 primer covers demo vocabulary |

---

## 13. Summary — the three sentences to remember

1. This challenge is a **trust-engineering problem wearing a legal-tech costume**: the graph, the refusal, and the citations matter more than raw AI cleverness.
2. Your differentiation is **provability**: every claim verified against source, every dependency a real edge, every refusal scoped and explained, every decision audited.
3. The demo's emotional peak is the machine **refusing to guess** — and then evaluating instantly when the missing exhibit arrives. Build the whole show around that moment.

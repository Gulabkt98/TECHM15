#  LexGuard AI - Frontend Architecture

> Enterprise Legal Intelligence Platform

---

# 📑 Table of Contents

1. Overview
2. Design Philosophy
3. User Journey
4. Screen Flow
5. Frontend Architecture
6. Folder Structure
7. Pages
8. Components
9. Layout System
10. State Management
11. API Communication
12. Features
13. UI Components
14. Edge Cases
15. Design System
16. Development Roadmap

---

# 1. Overview

The frontend is designed as a modern **Legal AI Workspace** rather than a traditional dashboard.

The application helps lawyers review contracts, detect risks, compare agreements, interact with AI, and generate reports through a clean, enterprise-grade interface.

Technology

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- Shadcn UI
- Framer Motion
- React Flow
- Zustand
- TanStack Query

---

# 2. Design Philosophy

Inspired by

• Linear

• Notion

• GitHub

• Vercel

• ChatGPT

Goals

✔ Minimal

✔ Professional

✔ Enterprise

✔ Fast

✔ Responsive

✔ Accessible

✔ AI-first

---

# 3. User Journey

```text
Login

↓

Dashboard

↓

Create Project

↓

Upload Documents

↓

Validation

↓

AI Processing

↓

Analysis Dashboard

↓

Review Risks

↓

Accept / Reject Suggestions

↓

Generate Report

↓

Export
```

---

# 4. Screen Flow

```text
Authentication

↓

Dashboard

↓

Projects

↓

Upload Center

↓

Processing Screen

↓

Analysis Workspace

├── Contract Viewer

├── AI Chat

├── Risk Dashboard

├── Comparison

├── Knowledge Graph

└── Reports

↓

Export
```

---

# 5. Frontend Architecture

```text
                          Browser

                              │

                              ▼

                   Next.js Application

                              │

────────────────────────────────────────────────────────────

Layout

│

├── Sidebar

├── Navbar

├── Notification Center

└── AI Status

────────────────────────────────────────────────────────────

Pages

│

├── Dashboard

├── Projects

├── Upload

├── Processing

├── Analysis

├── Compare

├── Contract Viewer

├── Graph

├── Reports

├── Notifications

└── Settings

────────────────────────────────────────────────────────────

Reusable Components

│

├── Upload

├── Risk Cards

├── Graph

├── PDF Viewer

├── AI Chat

├── Reports

├── Timeline

├── Feedback

└── Common UI

────────────────────────────────────────────────────────────

API Layer

↓

Backend
```

---

# 6. Folder Structure

```text
frontend/

│

├── app/

│   ├── dashboard/

│   ├── projects/

│   ├── upload/

│   ├── processing/

│   ├── analysis/

│   ├── compare/

│   ├── graph/

│   ├── contracts/

│   ├── reports/

│   ├── notifications/

│   ├── settings/

│   └── profile/

│

├── components/

│   ├── layout/

│   ├── dashboard/

│   ├── upload/

│   ├── analysis/

│   ├── graph/

│   ├── contracts/

│   ├── compare/

│   ├── reports/

│   ├── ai-chat/

│   ├── notifications/

│   ├── feedback/

│   ├── common/

│   └── ui/

│

├── services/

├── hooks/

├── store/

├── utils/

├── lib/

├── assets/

├── styles/

└── types/
```

---

# 7. Main Pages

## Dashboard

Purpose

Display

- Recent Projects
- Pending Reviews
- High Risks
- Compliance
- Statistics

---

## Projects

- Create Project
- Open Project
- Delete Project
- Search Projects

---

## Upload

Upload

- MSA
- SOW
- NDA
- Playbook
- Policies

Drag & Drop

Progress

Validation

---

## Processing

Live Processing

Show

- OCR
- Clause Extraction
- Graph Building
- AI Analysis
- Report Generation

---

## Analysis Dashboard

Main Workspace

Contains

- Risk Dashboard
- Contract Viewer
- AI Copilot
- Knowledge Graph
- Timeline
- Reports

---

## Contract Viewer

Display

- PDF
- Clause
- Evidence
- AI Explanation
- Confidence

---

## Compare

MSA vs SOW

Version Comparison

Clause Comparison

Missing Clauses

---

## Knowledge Graph

Interactive Graph

Relationships

Dependencies

References

---

## AI Copilot

Ask

- Explain Clause
- Compare Contracts
- Find Risks
- Rewrite Clause
- Summarize Contract

---

## Reports

Executive Summary

Risk Report

Compliance

Recommendations

Export PDF

---

# 8. Component Architecture

```text
components/

layout/

Sidebar

Navbar

Footer

────────────────────

dashboard/

StatCard

RiskChart

ActivityCard

ComplianceCard

────────────────────

upload/

Dropzone

FileCard

ProgressBar

────────────────────

analysis/

RiskCard

EvidenceCard

ConfidenceCard

RecommendationCard

────────────────────

contract/

PDFViewer

ClauseViewer

HighlightPanel

────────────────────

compare/

ComparisonTable

DiffViewer

────────────────────

graph/

GraphCanvas

GraphNode

GraphEdge

────────────────────

chat/

ChatWindow

PromptBox

Message

────────────────────

reports/

SummaryCard

ExportButton

────────────────────

common/

Button

Loader

Modal

Toast

Skeleton

Badge

EmptyState
```

---

# 9. Layout System

```text
┌───────────────────────────────────────────────────────────────┐
│ Navbar (Search • Notifications • User • AI Status)            │
├───────────────┬─────────────────────────────────────┬─────────┤
│ Sidebar       │ Main Workspace                      │ AI Panel│
│               │                                     │         │
│ Dashboard     │ Contract Viewer                     │ Chat    │
│ Projects      │ Risk Dashboard                      │ Explain │
│ Upload        │ Comparison                          │ History │
│ Analysis      │ Knowledge Graph                     │         │
│ Reports       │ Timeline                            │         │
└───────────────┴─────────────────────────────────────┴─────────┘
```

---

# 10. State Management

Use Zustand

Stores

- User
- Project
- Uploaded Files
- Contracts
- Risks
- Chat
- Graph
- Reports

Use TanStack Query

For

- API
- Caching
- Refetch
- Background Sync

---

# 11. API Communication

```text
Frontend

↓

Upload API

↓

Parser API

↓

Analysis API

↓

Graph API

↓

Chat API

↓

Report API

↓

Frontend Updates
```

---

# 12. Features

## Core

- Authentication
- Project Management
- Contract Upload
- Progress Tracking
- AI Processing
- Risk Dashboard
- Contract Viewer
- Comparison
- AI Chat
- Reports

---

## AI

- Clause Explanation
- Smart Search
- Redline Suggestions
- Explainable AI
- Confidence Score
- Clause Relationships

---

## Enterprise

- Audit Trail
- Feedback
- Notifications
- Version Comparison
- Human Review

---

# 13. Edge Cases

Display UI for

✔ Unsupported Language

✔ Password Protected PDF

✔ Corrupted Files

✔ Missing Pages

✔ OCR Failure

✔ Prompt Injection

✔ Low Confidence

✔ Missing Annexures

✔ Long Processing

✔ AI Failure

---

# 14. Design System

Primary

Blue

#2563EB

Success

Green

#16A34A

Warning

Orange

#F59E0B

Danger

Red

#DC2626

Background

#F8FAFC

Cards

White

Radius

16px

Shadow

Soft

Typography

Inter

Animations

Framer Motion

Icons

Lucide

---

# 15. UI Principles

Every screen should answer

• What is happening?

• What is AI doing?

• Why is this risky?

• Where is the evidence?

• What should I review?

• What action should I take?

Never leave the user confused.

---

# 16. Development Roadmap

Phase 1

✔ Authentication

✔ Dashboard

✔ Upload

✔ Projects

---

Phase 2

✔ Processing Screen

✔ Contract Viewer

✔ Risk Dashboard

✔ Comparison

---

Phase 3

✔ AI Chat

✔ Knowledge Graph

✔ Reports

✔ Notifications

---

Phase 4

✔ Feedback

✔ Export

✔ Settings

✔ Profile

---

# 🎯 Final UI Goal

The application should feel like

GitHub (Review)

+

Notion (Workspace)

+

ChatGPT (AI Copilot)

+

Linear (Professional UI)

+

Vercel Dashboard (Analytics)

instead of a traditional admin panel.

The interface should guide lawyers through reviewing contracts efficiently while making AI decisions transparent, explainable, and easy to validate.


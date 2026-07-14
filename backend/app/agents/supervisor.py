"""Supervisor Agent — LangGraph orchestration of the review pipeline.

Design decision: agents are LangGraph nodes over a shared ReviewState,
wired in an explicit topology (parse → graph → gate → analysis fan-out →
citation gate → redline → report). The Supervisor owns routing and the
completeness-gate branch; individual agents stay single-purpose.
"""

from langgraph.graph import END, StateGraph

from app.agents.citation_agent import CitationAgent
from app.agents.compliance_agent import ComplianceAgent
from app.agents.contradiction_agent import ContradictionAgent
from app.agents.graph_agent import GraphAgent
from app.agents.parser_agent import ParserAgent
from app.agents.rag_agent import RagAgent
from app.agents.redline_agent import RedlineAgent
from app.agents.report_agent import ReportAgent
from app.agents.risk_agent import RiskAgent
from app.agents.state import ReviewState


def build_review_graph() -> StateGraph:
    """Assemble the multi-agent review pipeline as a LangGraph StateGraph."""
    graph = StateGraph(ReviewState)

    graph.add_node("parser", ParserAgent().run)
    graph.add_node("graph_builder", GraphAgent().run)
    graph.add_node("retrieval", RagAgent().run)
    graph.add_node("risk", RiskAgent().run)
    graph.add_node("compliance", ComplianceAgent().run)
    graph.add_node("contradiction", ContradictionAgent().run)
    graph.add_node("citation", CitationAgent().run)
    graph.add_node("redline", RedlineAgent().run)
    graph.add_node("report", ReportAgent().run)

    graph.set_entry_point("parser")
    graph.add_edge("parser", "graph_builder")
    # GraphAgent runs the completeness gate; analysis proceeds on the
    # evaluable subgraph even when evidence gaps exist (scoped refusal).
    graph.add_edge("graph_builder", "retrieval")
    graph.add_edge("retrieval", "risk")
    graph.add_edge("risk", "compliance")
    graph.add_edge("compliance", "contradiction")
    graph.add_edge("contradiction", "citation")   # grounding gate lives here
    graph.add_edge("citation", "redline")
    graph.add_edge("redline", "report")
    graph.add_edge("report", END)

    return graph


def compile_review_pipeline():
    return build_review_graph().compile()

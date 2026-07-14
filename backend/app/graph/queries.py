"""Reusable Cypher queries for the clause graph."""

BLAST_RADIUS = """
MATCH (e:ExternalRef {status: 'missing', family_id: $family_id})
      <-[:INCORPORATES]-(c:Clause)
MATCH (dep:Clause)-[:REFERENCES|CONDITIONS_ON*0..5]->(c)
RETURN e.name AS missing_doc, collect(DISTINCT dep.clause_ref) AS blocked
"""

EXPORT_FAMILY_GRAPH = """
MATCH (a:Clause {family_id: $family_id})-[r]->(b:Clause)
RETURN a.clause_ref AS source, type(r) AS edge, b.clause_ref AS target,
       r.trigger_text AS trigger
"""

#!/usr/bin/env python3
"""
SUTRA — Neo4j AuraDB Cloud Database Seeder Script.
Connects to Neo4j AuraDB instance using environment variables and seeds
the full criminal network dataset (50+ nodes, 48+ relationships, 3 master cases).
"""
import sys
import os
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.config import settings
from app.services.seed_data import seed_database
from app.services.neo4j_service import neo4j_service

def main():
    print("=" * 70)
    print(" SUTRA — NEO4J AURADB CLOUD SEEDER")
    print("=" * 70)
    print(f"Target URI:      {settings.NEO4J_URI or '(not set in .env)'}")
    print(f"Username:        {settings.NEO4J_USER}")
    print(f"Password Set:    {'Yes (hidden)' if settings.NEO4J_PASSWORD else 'No (missing in .env)'}")
    print(f"USE_NEO4J Flag:  {settings.USE_NEO4J}")
    print("-" * 70)

    if not settings.NEO4J_URI or not settings.NEO4J_PASSWORD or "your-instance" in settings.NEO4J_URI:
        print("\n[WARNING] Neo4j AuraDB credentials not yet populated in .env!")
        print("Please update your .env file with:")
        print("  NEO4J_URI=neo4j+s://<YOUR_INSTANCE_ID>.databases.neo4j.io")
        print("  NEO4J_USER=neo4j")
        print("  NEO4J_PASSWORD=<YOUR_AURADB_PASSWORD>")
        print("  USE_NEO4J=true")
        print("\nProceeding to seed in-memory GraphEngine...")
        seed_database()
        return

    # Test connection
    print("\n[1/3] Testing TLS connection to Neo4j AuraDB...")
    status = neo4j_service.verify_connectivity()
    if status.get("status") == "CONNECTED":
        print(f"  [SUCCESS] Connected to AuraDB! Server time: {status.get('server_time')}")
    else:
        print(f"  [ERROR] Connection failed: {status.get('error')}")
        print("  Please check your URI, username, and password in .env.")
        return

    # Seed Database
    print("\n[2/3] Seeding 3 Scenario Datasets into Neo4j AuraDB & In-Memory Engine...")
    nodes, edges = seed_database()

    print("\n[3/3] Verifying Graph Topology in AuraDB...")
    with neo4j_service.driver.session() as session:
        res = session.run("""
            MATCH (n:Entity)
            RETURN count(n) AS nodes, size([(n)-[r]->() | r]) AS edges
        """)
        rec = res.single()
        print(f"  [VERIFIED] AuraDB contains {rec['nodes']} Entity nodes and {rec['edges']} relationships.")

    print("\n" + "=" * 70)
    print(" SUTRA Neo4j AuraDB Seeding Completed Successfully! ")
    print("=" * 70)

if __name__ == "__main__":
    main()

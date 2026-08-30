import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "CrimeNet — AI Criminal Network Analysis System"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "crimenet-super-secret-mha-sih-2026-key-981273918237")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Neo4j settings (optional / fallback to high-performance NetworkX graph engine)
    NEO4J_URI: str = os.getenv("NEO4J_URI", "bolt://localhost:7687")
    NEO4J_USER: str = os.getenv("NEO4J_USER", "neo4j")
    NEO4J_PASSWORD: str = os.getenv("NEO4J_PASSWORD", "password")
    USE_NEO4J: bool = os.getenv("USE_NEO4J", "false").lower() == "true"

settings = Settings()

import os
from pathlib import Path
from dotenv import load_dotenv
from pydantic import BaseModel

# Load environment variables from backend/.env or root .env
env_backend = Path(__file__).resolve().parent.parent / ".env"
env_root = Path(__file__).resolve().parent.parent.parent / ".env"
if env_backend.exists():
    load_dotenv(env_backend, override=True)
elif env_root.exists():
    load_dotenv(env_root, override=True)
else:
    load_dotenv(override=True)

class Settings(BaseModel):
    PROJECT_NAME: str = "SUTRA — AI Criminal Network Analysis & Chain of Custody System"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "crimenet-super-secret-mha-sih-2026-key-981273918237")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Neo4j AuraDB Cloud settings
    NEO4J_URI: str = os.getenv("NEO4J_URI", "")
    NEO4J_USER: str = os.getenv("NEO4J_USER", "neo4j")
    NEO4J_PASSWORD: str = os.getenv("NEO4J_PASSWORD", "")
    USE_NEO4J: bool = os.getenv("USE_NEO4J", "false").lower() in ("true", "1", "yes")

settings = Settings()

import os
from dataclasses import dataclass, field


@dataclass(frozen=True)
class Settings:
    # In production this key lives in HashiCorp Vault / an HSM and is never in an env file.
    blind_index_key: bytes = os.environ.get("BLIND_INDEX_KEY", "dev-only-not-secret").encode()
    database_url: str = os.environ.get("DATABASE_URL", "postgresql://apaar:apaar@localhost:5432/apaar_satya")
    cors_origins: list[str] = field(default_factory=lambda: os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(","))


settings = Settings()

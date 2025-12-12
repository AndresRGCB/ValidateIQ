from pydantic_settings import BaseSettings
from pydantic import field_validator
import os


class Settings(BaseSettings):
    database_url: str = "postgresql://validateiq:validateiq@localhost:5432/validateiq"
    environment: str = "development"

    @field_validator("database_url", mode="before")
    @classmethod
    def get_database_url(cls, v):
        # Check multiple possible environment variable names
        return (
            os.getenv("DATABASE_URL") or
            os.getenv("DATABASE_PRIVATE_URL") or
            os.getenv("POSTGRES_URL") or
            os.getenv("RAILWAY_DATABASE_URL") or
            v
        )

    class Config:
        env_file = ".env"
        extra = "ignore"


def get_settings() -> Settings:
    # Always create fresh settings to pick up environment variables
    return Settings()

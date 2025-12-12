import os


class Settings:
    def __init__(self):
        # Read directly from environment variables
        self.database_url = (
            os.environ.get("DATABASE_URL") or
            os.environ.get("DATABASE_PRIVATE_URL") or
            os.environ.get("DATABASE_PUBLIC_URL") or
            os.environ.get("POSTGRES_URL") or
            "postgresql://validateiq:validateiq@localhost:5432/validateiq"
        )
        self.environment = os.environ.get("ENVIRONMENT", "development")

        # Debug: print which URL we're using (without password)
        if "localhost" not in self.database_url:
            print(f"[CONFIG] Using database URL from environment")
        else:
            print(f"[CONFIG] WARNING: Using localhost database URL - no env var found")
            print(f"[CONFIG] Available env vars: {[k for k in os.environ.keys() if 'DATA' in k or 'POSTGRES' in k or 'PG' in k]}")


def get_settings() -> Settings:
    return Settings()

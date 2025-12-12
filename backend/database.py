from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

# Module level cache - initialized at runtime, not import time
_engine = None
_SessionLocal = None


def get_engine():
    global _engine
    if _engine is None:
        # Import here to avoid import-time execution
        from backend.config import get_settings
        settings = get_settings()
        print(f"[DATABASE] Creating engine with URL: {settings.database_url[:20]}...")
        _engine = create_engine(settings.database_url)
    return _engine


def get_session_local():
    global _SessionLocal
    if _SessionLocal is None:
        _SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=get_engine())
    return _SessionLocal


def get_db():
    SessionLocal = get_session_local()
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

import os
from pathlib import Path
from sqlmodel import SQLModel, create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.engine import Engine

def get_database_url() -> str:
    url = os.getenv("DATABASE_URL", "")
    if url:
        return url
    return f"sqlite:///{get_default_db_path()}"

def get_default_db_path() -> Path:
    return Path("/tmp") / "dailyfinance.db"

def create_engine_by_url(database_url: str) -> Engine:
    if database_url.startswith("sqlite"):
        db_path = database_url.replace("sqlite:///", "")
        os.makedirs(Path(db_path).parent, exist_ok=True)
        return create_engine(
            database_url,
            echo=False,
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
    elif database_url.startswith("postgresql") or database_url.startswith("postgres"):
        return create_engine(
            database_url,
            echo=False,
            pool_pre_ping=True,
            pool_size=5,
            max_overflow=10,
        )
    elif database_url.startswith("mysql"):
        return create_engine(
            database_url,
            echo=False,
            pool_pre_ping=True,
        )
    else:
        raise ValueError(f"Unsupported database URL: {database_url}")

DATABASE_URL = get_database_url()
engine = create_engine_by_url(DATABASE_URL)

def get_db_session():
    from sqlmodel import Session
    return Session(engine)

def get_engine():
    return engine

def create_db_and_tables(engine):
    SQLModel.metadata.create_all(engine)

def get_database_type() -> str:
    url = get_database_url()
    if url.startswith("sqlite"):
        return "sqlite"
    elif url.startswith("postgresql") or url.startswith("postgres"):
        return "postgresql"
    elif url.startswith("mysql"):
        return "mysql"
    return "unknown"

IS_PRODUCTION = os.getenv("ENVIRONMENT", "development") == "production"
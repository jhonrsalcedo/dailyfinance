import os
from pathlib import Path
from sqlmodel import SQLModel, create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.engine import Engine

# ============================================
# Environment Detection
# ============================================
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
IS_DEVELOPMENT = ENVIRONMENT == "development"
IS_PRODUCTION = ENVIRONMENT == "production"

# ============================================
# Database Configuration
# ============================================
def get_database_url() -> str:
    return os.getenv("DATABASE_URL", "")

def get_default_db_path() -> Path:
    if IS_PRODUCTION:
        # Render: use /tmp (ephemeral)
        return Path("/tmp") / "dailyfinance.db"
    else:
        # Development: use local db folder
        return Path(__file__).parent.parent.parent / "db" / "dailyfinance.db"

def create_engine_by_url(database_url: str) -> Engine:
    # Use explicit DATABASE_URL if set
    if database_url:
        return create_postgresql_engine(database_url)
    
    # Fallback to SQLite local
    db_path = get_default_db_path()
    os.makedirs(db_path.parent, exist_ok=True)
    url = f"sqlite:///{db_path}"
    return create_engine(
        url,
        echo=False,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

def create_postgresql_engine(database_url: str) -> Engine:
    if database_url.startswith("postgres"):
        return create_engine(
            database_url,
            echo=False,
            pool_pre_ping=True,
            pool_size=5,
            max_overflow=10,
        )
    elif database_url.startswith("sqlite"):
        if "/tmp" in database_url or ":/" in database_url:
            return create_engine(
                database_url,
                echo=False,
                connect_args={"check_same_thread": False},
                poolclass=StaticPool,
            )
        else:
            db_path = Path(database_url.replace("sqlite:///", ""))
            os.makedirs(db_path.parent, exist_ok=True)
            return create_engine(
                database_url,
                echo=False,
                connect_args={"check_same_thread": False},
                poolclass=StaticPool,
            )
    else:
        raise ValueError(f"Unsupported database URL: {database_url}")

# ============================================
# Engine Initialization
# ============================================
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
    if url.startswith("postgres"):
        return "postgresql"
    elif url.startswith("sqlite"):
        return "sqlite"
    return "unknown"

# ============================================
# Environment Info
# ============================================
def get_env_info() -> dict:
    return {
        "environment": ENVIRONMENT,
        "database_type": get_database_type(),
        "database_url": DATABASE_URL.replace(
            os.getenv("TURSO_AUTH_TOKEN", ""),
            "***"
        ) if DATABASE_URL else "sqlite-local",
    }
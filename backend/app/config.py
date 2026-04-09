import os
from pathlib import Path
from sqlmodel import SQLModel, create_engine

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    db_path = Path(__file__).parent.parent.parent / "db" / "dailyfinance.db"
    sqlite_url = f"sqlite:///{db_path}"
    engine = create_engine(sqlite_url, echo=False)
else:
    engine = create_engine(DATABASE_URL)

def get_engine():
    return engine

def create_db_and_tables(engine):
    SQLModel.metadata.create_all(engine)
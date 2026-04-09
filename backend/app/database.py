from typing import Optional
from pathlib import Path
from sqlmodel import Field, SQLModel, create_engine, Session

db_path = Path(__file__).parent.parent.parent / "db" / "dailyfinance.db"
sqlite_url = f"sqlite:///{db_path}"
engine = create_engine(sqlite_url, echo=False)

def create_db_and_tables(engine):
    SQLModel.metadata.create_all(engine)

class Category(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    icon: Optional[str]
    color: Optional[str]

class PaymentMethod(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    type: str

class Transaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    amount: float = Field(gt=0.0)
    date: str = Field(index=True)
    description: Optional[str]
    category_id: Optional[int] = Field(default=None, foreign_key="category.id")
    method_id: Optional[int] = Field(default=None, foreign_key="paymentmethod.id")

class MonthlyBudget(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    month: str = Field(index=True)
    category_id: int = Field(foreign_key="category.id")
    limit_amount: float = Field(ge=0.0)
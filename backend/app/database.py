from typing import Optional
from pathlib import Path
from sqlmodel import Field, SQLModel, create_engine, Session

db_path = Path(__file__).parent.parent.parent / "db" / "dailyfinance.db"
sqlite_url = f"sqlite:///{db_path}"
engine = create_engine(sqlite_url, echo=False)

def create_db_and_tables(engine):
    SQLModel.metadata.create_all(engine)

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: str
    username: Optional[str] = Field(default="Usuario", max_length=100)
    created_at: Optional[str] = Field(default=None)

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

class UserSettings(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: Optional[str] = Field(default="Usuario", max_length=100)
    email: Optional[str] = Field(default=None, max_length=255)
    salary: Optional[float] = Field(default=None)
    currency: Optional[str] = Field(default="COP", max_length=3)
    notifications_enabled: Optional[bool] = Field(default=True)
    created_at: Optional[str] = Field(default=None)
    updated_at: Optional[str] = Field(default=None)
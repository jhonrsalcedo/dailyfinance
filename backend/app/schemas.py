from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator

class CategoryBase(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    icon: Optional[str] = None
    color: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryRead(CategoryBase):
    id: int

class PaymentMethodBase(BaseModel):
    name: str = Field(min_length=1, max_length=50)
    type: str = Field(pattern="^(cash|debit|credit)$")

class PaymentMethodRead(PaymentMethodBase):
    id: int

class TransactionBase(BaseModel):
    amount: float = Field(gt=0)
    date: str
    description: Optional[str] = Field(default=None, max_length=500)
    category_id: Optional[int] = Field(default=None, gt=0)
    method_id: Optional[int] = Field(default=None, gt=0)

    @field_validator('date')
    @classmethod
    def validate_date(cls, v: str) -> str:
        try:
            datetime.strptime(v, '%Y-%m-%d')
        except ValueError:
            raise ValueError('Date must be in YYYY-MM-DD format')
        return v

class TransactionCreate(TransactionBase):
    pass

class TransactionRead(TransactionBase):
    id: int
    category: Optional[CategoryRead] = None
    method: Optional[PaymentMethodRead] = None

class TransactionUpdate(BaseModel):
    amount: Optional[float] = Field(default=None, gt=0)
    date: Optional[str] = None
    description: Optional[str] = Field(default=None, max_length=500)
    category_id: Optional[int] = Field(default=None, gt=0)
    method_id: Optional[int] = Field(default=None, gt=0)

    @field_validator('date')
    @classmethod
    def validate_date(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        try:
            datetime.strptime(v, '%Y-%m-%d')
        except ValueError:
            raise ValueError('Date must be in YYYY-MM-DD format')
        return v

class BudgetBase(BaseModel):
    month: str
    limit_amount: float = Field(gt=0)

    @field_validator('month')
    @classmethod
    def validate_month(cls, v: str) -> str:
        try:
            datetime.strptime(v, '%Y-%m')
        except ValueError:
            raise ValueError('Month must be in YYYY-MM format')
        return v

class BudgetCreate(BudgetBase):
    category_id: int = Field(gt=0)

class BudgetRead(BudgetBase):
    id: int
    category: CategoryRead
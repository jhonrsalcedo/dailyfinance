from typing import Optional
from pydantic import BaseModel, Field

class CategoryBase(BaseModel):
    name: str
    icon: Optional[str] = None
    color: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryRead(CategoryBase):
    id: int

class PaymentMethodBase(BaseModel):
    name: str
    type: str

class PaymentMethodRead(PaymentMethodBase):
    id: int

class TransactionBase(BaseModel):
    amount: float
    date: str
    description: Optional[str] = None
    category_id: Optional[int] = None
    method_id: Optional[int] = None

class TransactionCreate(TransactionBase):
    pass

class TransactionRead(TransactionBase):
    id: int
    category: Optional[CategoryRead] = None
    method: Optional[PaymentMethodRead] = None

class BudgetBase(BaseModel):
    month: str
    limit_amount: float = Field(gt=0)

class BudgetCreate(BudgetBase):
    category_id: int

class BudgetRead(BudgetBase):
    id: int
    category: CategoryRead
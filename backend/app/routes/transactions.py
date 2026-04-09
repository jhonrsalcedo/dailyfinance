from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlmodel import Session, select, func

from app.database import engine, Transaction, Category, PaymentMethod
from app.schemas import TransactionCreate, TransactionRead

router = APIRouter()

def get_session():
    with Session(engine) as session:
        yield session

@router.post("/", response_model=TransactionRead)
def create_transaction(transaction: TransactionCreate, session: Session = Depends(get_session)):
    db_transaction = Transaction.model_validate(transaction)
    session.add(db_transaction)
    session.commit()
    session.refresh(db_transaction)
    return db_transaction

@router.get("/", response_model=List[TransactionRead])
def read_transactions(
    session: Session = Depends(get_session),
    category_id: Optional[int] = Query(None),
    month: Optional[str] = Query(None, description="Format YYYY-MM")
):
    statement = select(Transaction).order_by(Transaction.date.desc())
    
    if category_id:
        statement = statement.where(Transaction.category_id == category_id)
    
    if month:
        statement = statement.where(Transaction.date.like(f'{month}-%'))

    transactions = session.exec(statement).all()
    return transactions

@router.get("/stats")
def get_stats(session: Session = Depends(get_session)):
    month_filter = '2026-03'

    total_result = session.exec(
        select(func.sum(Transaction.amount))
        .where(Transaction.date.like(f'{month_filter}-%'))
        .where(Transaction.amount < 0)
    ).one_or_none()
    
    total_expenses = abs(total_result[0]) if total_result and total_result[0] else 0.0

    category_expenses = session.exec(
        select(Category.name, func.sum(Transaction.amount))
        .join(Transaction, Category.id == Transaction.category_id)
        .where(Transaction.date.like(f'{month_filter}-%'))
        .where(Transaction.amount < 0)
        .group_by(Category.name)
    ).all()

    return {
        "total_expenses": total_expenses,
        "expenses_by_category": [
            {"category": name, "total": abs(amount)}
            for name, amount in category_expenses
        ]
    }
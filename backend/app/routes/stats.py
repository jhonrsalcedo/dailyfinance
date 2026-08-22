from typing import Optional
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, Query
from sqlmodel import Session, select
from app.config import engine
from app.database import Transaction, Category, User
from app.routes.auth import get_current_user

router = APIRouter()

def get_db():
    with Session(engine) as session:
        yield session

def get_month_range(month: str):
    year, m = map(int, month.split('-'))
    month_start = f"{year:04d}-{m:02d}-01"
    if m == 12:
        month_end = f"{year + 1:04d}-01-01"
    else:
        month_end = f"{year:04d}-{m + 1:02d}-01"
    return month_start, month_end

@router.get("/monthly")
def get_monthly_stats(
    month: Optional[str] = None,
    session: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if month is None:
        month = datetime.now().strftime("%Y-%m")

    month_start, month_end = get_month_range(month)

    statement = select(Transaction).where(
        Transaction.date >= month_start,
        Transaction.date < month_end,
        Transaction.user_id == current_user.id
    )
    transactions = session.exec(statement).all()

    income = sum(t.amount for t in transactions if t.category_id == 1)
    expenses = sum(t.amount for t in transactions if t.category_id != 1)

    return {
        "month": month,
        "income": income,
        "expenses": expenses,
        "balance": income - expenses
    }

@router.get("/by-category")
def get_stats_by_category(
    month: Optional[str] = None,
    session: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if month is None:
        month = datetime.now().strftime("%Y-%m")

    month_start, month_end = get_month_range(month)
    categories = session.exec(select(Category)).all()

    result = []
    for cat in categories:
        statement = select(Transaction).where(
            Transaction.category_id == cat.id,
            Transaction.date >= month_start,
            Transaction.date < month_end,
            Transaction.user_id == current_user.id
        )
        transactions = session.exec(statement).all()
        total = sum(t.amount for t in transactions)
        if total > 0:
            result.append({
                "category_id": cat.id,
                "category_name": cat.name,
                "total": total
            })

    return result

@router.get("/history")
def get_history_stats(
    months: int = Query(default=6),
    session: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    all_transactions = session.exec(
        select(Transaction).where(Transaction.user_id == current_user.id)
    ).all()

    result = []
    for i in range(months):
        d = datetime.now() - timedelta(days=30 * i)
        month = d.strftime("%Y-%m")
        month_start, month_end = get_month_range(month)

        month_transactions = [
            t for t in all_transactions
            if t.date >= month_start and t.date < month_end
        ]

        income = sum(t.amount for t in month_transactions if t.category_id == 1)
        expenses = sum(t.amount for t in month_transactions if t.category_id != 1)

        result.append({
            "month": month,
            "income": income,
            "expenses": expenses
        })

    result.reverse()
    return result

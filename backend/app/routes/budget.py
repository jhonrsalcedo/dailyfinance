from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.config import engine
from app.database import MonthlyBudget, Transaction, User
from app.routes.auth import get_current_user

router = APIRouter()

def get_db():
    with Session(engine) as session:
        yield session

def calculate_spent(session: Session, category_id: int, month: str, user_id: int) -> float:
    month_start = f"{month}-01"
    if month[5:] == "12":
        month_end = f"{int(month[:4]) + 1:04d}-01-01"
    else:
        month_end = f"{month[:4]}-{int(month[5:]) + 1:02d}-01"
    statement = select(Transaction).where(
        Transaction.category_id == category_id,
        Transaction.date >= month_start,
        Transaction.date < month_end,
        Transaction.user_id == user_id
    )
    transactions = session.exec(statement).all()
    return sum(t.amount for t in transactions)

@router.get("/", response_model=List[dict])
def read_budgets(
    month: Optional[str] = None,
    session: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if month is None:
        month = datetime.now().strftime("%Y-%m")

    statement = select(MonthlyBudget).where(
        MonthlyBudget.month == month,
        MonthlyBudget.user_id == current_user.id
    )
    budgets = session.exec(statement).all()

    result = []
    for b in budgets:
        spent = calculate_spent(session, b.category_id, month, current_user.id)
        result.append({
            "id": b.id,
            "month": b.month,
            "category_id": b.category_id,
            "limit_amount": b.limit_amount,
            "spent_amount": spent,
            "remaining": b.limit_amount - spent
        })
    return result

@router.post("/", response_model=MonthlyBudget)
def create_budget(
    budget: MonthlyBudget,
    session: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = session.exec(
        select(MonthlyBudget).where(
            MonthlyBudget.month == budget.month,
            MonthlyBudget.category_id == budget.category_id,
            MonthlyBudget.user_id == current_user.id
        )
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ya existe presupuesto para esta categoría en el mes")

    db_budget = MonthlyBudget(
        month=budget.month,
        category_id=budget.category_id,
        limit_amount=budget.limit_amount,
        user_id=current_user.id
    )
    session.add(db_budget)
    session.commit()
    session.refresh(db_budget)
    return db_budget

@router.put("/{budget_id}", response_model=MonthlyBudget)
def update_budget(
    budget_id: int,
    budget: MonthlyBudget,
    session: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = get_owned_budget_or_403(budget_id, session, current_user)

    if budget.limit_amount is not None:
        existing.limit_amount = budget.limit_amount

    session.add(existing)
    session.commit()
    session.refresh(existing)
    return existing

@router.delete("/{budget_id}")
def delete_budget(
    budget_id: int,
    session: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    budget = get_owned_budget_or_403(budget_id, session, current_user)
    session.delete(budget)
    session.commit()
    return {"message": "Presupuesto eliminado"}

def get_owned_budget_or_403(budget_id: int, session: Session, current_user: User) -> MonthlyBudget:
    budget = session.get(MonthlyBudget, budget_id)
    if not budget:
        raise HTTPException(status_code=404, detail="Presupuesto no encontrado")
    if budget.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="No tienes permiso sobre este presupuesto")
    return budget

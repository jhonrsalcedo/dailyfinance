from typing import List, Optional
from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from app.config import engine
from app.database import MonthlyBudget, Transaction

router = APIRouter()

def get_db():
    with Session(engine) as session:
        return session

def calculate_spent(category_id: int, month: str) -> float:
    session = get_db()
    try:
        month_start = f"{month}-01"
        month_end = f"{month[:4]}-{int(month[5:]) + 1:02d}-01" if month[5:] != "12" else f"{int(month[:4]) + 1:04d}-01-01"
        statement = select(Transaction).where(
            Transaction.category_id == category_id,
            Transaction.date >= month_start,
            Transaction.date < month_end
        )
        transactions = session.exec(statement).all()
        return sum(t.amount for t in transactions)
    finally:
        session.close()

@router.get("/", response_model=List[dict])
def read_budgets(month: Optional[str] = None):
    session = get_db()
    try:
        if month is None:
            from datetime import datetime
            month = datetime.now().strftime("%Y-%m")
        
        statement = select(MonthlyBudget).where(MonthlyBudget.month == month)
        budgets = session.exec(statement).all()
        
        result = []
        for b in budgets:
            spent = calculate_spent(b.category_id, month)
            result.append({
                "id": b.id,
                "month": b.month,
                "category_id": b.category_id,
                "limit_amount": b.limit_amount,
                "spent_amount": spent,
                "remaining": b.limit_amount - spent
            })
        return result
    finally:
        session.close()

@router.post("/", response_model=MonthlyBudget)
def create_budget(budget: MonthlyBudget):
    session = get_db()
    try:
        existing = session.exec(
            select(MonthlyBudget).where(
                MonthlyBudget.month == budget.month,
                MonthlyBudget.category_id == budget.category_id
            )
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Ya existe presupuesto para esta categoría en el mes")
        session.add(budget)
        session.commit()
        session.refresh(budget)
        return budget
    finally:
        session.close()

@router.put("/{budget_id}", response_model=MonthlyBudget)
def update_budget(budget_id: int, budget: MonthlyBudget):
    session = get_db()
    try:
        existing = session.get(MonthlyBudget, budget_id)
        if not existing:
            raise HTTPException(status_code=404, detail="Presupuesto no encontrado")
        
        if budget.limit_amount is not None:
            existing.limit_amount = budget.limit_amount
        
        session.commit()
        session.refresh(existing)
        return existing
    finally:
        session.close()

@router.delete("/{budget_id}")
def delete_budget(budget_id: int):
    session = get_db()
    try:
        budget = session.get(MonthlyBudget, budget_id)
        if not budget:
            raise HTTPException(status_code=404, detail="Presupuesto no encontrado")
        session.delete(budget)
        session.commit()
        return {"message": "Presupuesto eliminado"}
    finally:
        session.close()
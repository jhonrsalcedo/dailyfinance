from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, Query, HTTPException
from fastapi.responses import StreamingResponse
from sqlmodel import Session, select, func
import csv
import io

from app.database import engine, Transaction, Category, PaymentMethod, User
from app.schemas import TransactionCreate, TransactionRead
from app.routes.auth import get_current_user
from app.database import User

router = APIRouter()

def get_session():
    with Session(engine) as session:
        yield session

def parse_month_filter(month: str) -> tuple[str, str]:
    return (f"{month}-01", f"{month}-31")

@router.post("/", response_model=TransactionRead)
def create_transaction(
    transaction: TransactionCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
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
        start_date, end_date = parse_month_filter(month)
        statement = statement.where(Transaction.date.between(start_date, end_date))

    transactions = session.exec(statement).all()
    return transactions

@router.get("/stats")
def get_stats(
    session: Session = Depends(get_session),
    month: Optional[str] = Query(None, description="Format YYYY-MM, defaults to current month")
):
    current_month = datetime.now().strftime("%Y-%m")
    month_filter = month or current_month
    start_date, end_date = parse_month_filter(month_filter)

    category_expenses = session.exec(
        select(
            Category.name,
            func.sum(Transaction.amount).label('total'),
            func.count(Transaction.id).label('count')
        )
        .join(Transaction, Category.id == Transaction.category_id)
        .where(Transaction.date.between(start_date, end_date))
        .where(Transaction.category_id != 1)
        .group_by(Category.id, Category.name)
    ).all()

    total_expenses = sum(abs(row.total) for row in category_expenses) if category_expenses else 0.0

    return {
        "total_expenses": total_expenses,
        "expenses_by_category": [
            {"category": row.name, "total": abs(row.total), "count": row.count}
            for row in category_expenses
        ]
    }

@router.delete("/{transaction_id}")
def delete_transaction(
    transaction_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    transaction = session.get(Transaction, transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transacción no encontrada")
    session.delete(transaction)
    session.commit()
    return {"message": "Transacción eliminada"}

@router.get("/export")
def export_transactions(
    session: Session = Depends(get_session),
    format: str = Query("csv", pattern="^(csv|excel)$"),
    month: Optional[str] = Query(None, description="Format YYYY-MM")
):
    current_month = datetime.now().strftime("%Y-%m")
    month_filter = month or current_month

    if month:
        start_date, end_date = parse_month_filter(month_filter)
        statement = (
            select(Transaction, Category.name, PaymentMethod.name)
            .outerjoin(Category, Transaction.category_id == Category.id)
            .outerjoin(PaymentMethod, Transaction.method_id == PaymentMethod.id)
            .where(Transaction.date.between(start_date, end_date))
            .order_by(Transaction.date.desc())
        )
    else:
        statement = (
            select(Transaction, Category.name, PaymentMethod.name)
            .outerjoin(Category, Transaction.category_id == Category.id)
            .outerjoin(PaymentMethod, Transaction.method_id == PaymentMethod.id)
            .order_by(Transaction.date.desc())
        )

    results = session.exec(statement).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['ID', 'Fecha', 'Monto', 'Descripción', 'Categoría', 'Método'])

    for row in results:
        t, cat_name, method_name = row
        writer.writerow([
            t.id,
            t.date,
            t.amount,
            t.description or '',
            cat_name or '',
            method_name or ''
        ])

    output.seek(0)
    filename = f"transacciones_{month_filter}.csv"

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
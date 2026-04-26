from typing import List
from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from app.database import engine, PaymentMethod

router = APIRouter()

def get_db():
    with Session(engine) as session:
        return session

@router.get("/", response_model=List[PaymentMethod])
def read_payment_methods():
    session = get_db()
    try:
        statement = select(PaymentMethod)
        methods = session.exec(statement).all()
        return methods
    finally:
        session.close()

@router.post("/", response_model=PaymentMethod)
def create_payment_method(method: PaymentMethod):
    session = get_db()
    try:
        existing = session.exec(select(PaymentMethod).where(PaymentMethod.name == method.name)).first()
        if existing:
            raise HTTPException(status_code=400, detail="El método de pago ya existe")
        session.add(method)
        session.commit()
        session.refresh(method)
        return method
    finally:
        session.close()
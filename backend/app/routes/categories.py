from typing import List
from fastapi import APIRouter
from sqlmodel import Session, select
from app.database import engine, Category

router = APIRouter()

def get_db():
    with Session(engine) as session:
        return session

@router.get("/", response_model=List[Category])
def read_categories():
    session = get_db()
    try:
        statement = select(Category)
        categories = session.exec(statement).all()
        return categories
    finally:
        session.close()

@router.post("/", response_model=Category)
def create_category(category: Category):
    session = get_db()
    try:
        session.add(category)
        session.commit()
        session.refresh(category)
        return category
    finally:
        session.close()
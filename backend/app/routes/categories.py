from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select, func
from app.database import engine, Category, Transaction, User
from app.routes.auth import get_current_user

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
def create_category(
    category: Category,
    current_user: User = Depends(get_current_user)
):
    session = get_db()
    try:
        existing = session.exec(select(Category).where(Category.name == category.name)).first()
        if existing:
            raise HTTPException(status_code=400, detail="La categoría ya existe")
        session.add(category)
        session.commit()
        session.refresh(category)
        return category
    finally:
        session.close()

@router.put("/{category_id}", response_model=Category)
def update_category(
    category_id: int,
    category: Category,
    current_user: User = Depends(get_current_user)
):
    session = get_db()
    try:
        existing = session.get(Category, category_id)
        if not existing:
            raise HTTPException(status_code=404, detail="Categoría no encontrada")
        
        if category.name and category.name != existing.name:
            duplicate = session.exec(select(Category).where(Category.name == category.name)).first()
            if duplicate:
                raise HTTPException(status_code=400, detail="Ya existe una categoría con ese nombre")
            existing.name = category.name
        
        if category.icon is not None:
            existing.icon = category.icon
        if category.color is not None:
            existing.color = category.color
        
        session.commit()
        session.refresh(existing)
        return existing
    finally:
        session.close()

@router.delete("/{category_id}")
def delete_category(
    category_id: int,
    current_user: User = Depends(get_current_user)
):
    session = get_db()
    try:
        category = session.get(Category, category_id)
        if not category:
            raise HTTPException(status_code=404, detail="Categoría no encontrada")
        
        usage_count = session.exec(
            select(func.count(Transaction.id))
            .where(Transaction.category_id == category_id)
        ).first()
        
        if usage_count and usage_count > 0:
            raise HTTPException(
                status_code=400, 
                detail=f"No se puede eliminar. La categoría está en uso ({usage_count} transacciones)"
            )
        
        session.delete(category)
        session.commit()
        return {"message": "Categoría eliminada"}
    finally:
        session.close()
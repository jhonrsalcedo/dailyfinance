from datetime import datetime
from sqlmodel import Session, select
from app.database import engine, Category, PaymentMethod

DEFAULT_CATEGORIES = [
    {"name": "Ingresos", "icon": "attach_money", "color": "#10b981"},
    {"name": "Vivienda", "icon": "home", "color": "#1e40af"},
    {"name": "Transporte", "icon": "directions_car", "color": "#3b82f6"},
    {"name": "Alimentación", "icon": "restaurant", "color": "#06b6d4"},
    {"name": "Entretenimiento", "icon": "movie", "color": "#8b5cf6"},
    {"name": "Salud", "icon": "local_hospital", "color": "#ef4444"},
    {"name": "Vehículo", "icon": "commute", "color": "#f59e0b"},
    {"name": "Familia", "icon": "family_restroom", "color": "#ec4899"},
    {"name": "Deudas", "icon": "credit_card", "color": "#64748b"},
    {"name": "Misceláneos", "icon": "category", "color": "#94a3b8"},
]

DEFAULT_PAYMENT_METHODS = [
    {"name": "Efectivo", "type": "cash"},
    {"name": "Tarjeta Débito", "type": "debit"},
    {"name": "Tarjeta Crédito", "type": "credit"},
]

def seed_database():
    """.seed_default_data() -> None
   _seed_default_data() -> None
    Seeds the database with default categories and payment methods if they don't exist.
    """
    with Session(engine) as session:
        existing_categories = session.exec(select(Category)).first()
        if existing_categories is None:
            for cat_data in DEFAULT_CATEGORIES:
                category = Category(**cat_data)
                session.add(category)
            print("✓ Categorías por defecto creadas")

        existing_methods = session.exec(select(PaymentMethod)).first()
        if existing_methods is None:
            for method_data in DEFAULT_PAYMENT_METHODS:
                method = PaymentMethod(**method_data)
                session.add(method)
            print("✓ Métodos de pago por defecto creados")

        session.commit()

def get_default_categories() -> list[dict]:
    return DEFAULT_CATEGORIES

def get_default_payment_methods() -> list[dict]:
    return DEFAULT_PAYMENT_METHODS
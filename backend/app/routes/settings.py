from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from app.database import engine, UserSettings
from app.routes.auth import get_current_user, User
from pydantic import BaseModel

router = APIRouter()

def get_db():
    with Session(engine) as session:
        return session

class SettingsResponse(BaseModel):
    id: int | None
    user_id: int | None
    username: str | None
    email: str | None
    salary: float | None
    currency: str | None
    notifications_enabled: bool | None
    created_at: str | None
    updated_at: str | None
    onboarding_completed: bool | None

class ProfileUpdate(BaseModel):
    username: str | None = None
    email: str | None = None
    currency: str | None = None
    notifications_enabled: bool | None = None
    salary: float | None = None

class SettingsUpdate(BaseModel):
    salary: float | None = None

def get_or_create_settings() -> UserSettings:
    session = get_db()
    try:
        settings = session.exec(select(UserSettings).where(UserSettings.id == 1)).first()
        if not settings:
            settings = UserSettings(
                id=1,
                username="Usuario",
                currency="COP",
                notifications_enabled=True
            )
            session.add(settings)
            session.commit()
            session.refresh(settings)
        return settings
    finally:
        session.close()

@router.get("/", response_model=SettingsResponse)
def get_settings():
    session = get_db()
    try:
        settings = session.exec(select(UserSettings).where(UserSettings.id == 1)).first()
        if not settings:
            settings = UserSettings(
                id=1,
                username="Demo",
                salary=0,
                currency="COP",
            )
            session.add(settings)
            session.commit()
            session.refresh(settings)
        return settings
    finally:
        session.close()

@router.get("/profile", response_model=SettingsResponse)
def get_profile():
    return get_settings()

@router.get("/onboarding-status")
def get_onboarding_status_public():
    session = get_db()
    try:
        settings = session.exec(select(UserSettings).where(UserSettings.id == 1)).first()
        return {"onboarding_completed": settings.onboarding_completed if settings else False}
    finally:
        session.close()

# Los siguientes SÍ requieren auth
@router.put("/profile", response_model=SettingsResponse)
def update_profile(profile_update: ProfileUpdate, current_user: User = Depends(get_current_user)):
    session = get_db()
    try:
        settings = session.exec(select(UserSettings).where(UserSettings.user_id == current_user.id)).first()
        now = datetime.now().isoformat()
        
        if not settings:
            settings = UserSettings(user_id=current_user.id)
            session.add(settings)
        
        if profile_update.username is not None:
            settings.username = profile_update.username
        if profile_update.email is not None:
            settings.email = profile_update.email
        if profile_update.currency is not None:
            settings.currency = profile_update.currency
        if profile_update.notifications_enabled is not None:
            settings.notifications_enabled = profile_update.notifications_enabled
        if profile_update.salary is not None:
            settings.salary = profile_update.salary
        
        settings.updated_at = now
        if not settings.created_at:
            settings.created_at = now
        
        session.commit()
        session.refresh(settings)
        return settings
    finally:
        session.close()

@router.post("/", response_model=SettingsResponse)
def update_settings(settings_update: SettingsUpdate):
    session = get_db()
    try:
        settings = session.exec(select(UserSettings).where(UserSettings.id == 1)).first()
        now = datetime.now().isoformat()
        
        if not settings:
            settings = UserSettings(id=1)
            session.add(settings)
        
        if settings_update.salary is not None:
            settings.salary = settings_update.salary
            settings.updated_at = now
            if not settings.created_at:
                settings.created_at = now
        
        session.commit()
        session.refresh(settings)
        return settings
    finally:
        session.close()

@router.post("/onboarding-complete")
def complete_onboarding():
    session = get_db()
    try:
        settings = session.exec(select(UserSettings).where(UserSettings.id == 1)).first()
        if settings:
            settings.onboarding_completed = True
            settings.updated_at = datetime.now().isoformat()
            session.commit()
        return {"onboarding_completed": True}
    finally:
        session.close()
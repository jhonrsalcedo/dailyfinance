from datetime import datetime
from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from app.database import engine, UserSettings
from pydantic import BaseModel

router = APIRouter()

def get_db():
    with Session(engine) as session:
        return session

class SettingsResponse(BaseModel):
    id: int | None
    username: str | None
    email: str | None
    salary: float | None
    currency: str | None
    notifications_enabled: bool | None
    created_at: str | None
    updated_at: str | None

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
    settings = get_or_create_settings()
    return settings

@router.get("/profile", response_model=SettingsResponse)
def get_profile():
    settings = get_or_create_settings()
    return settings

@router.put("/profile", response_model=SettingsResponse)
def update_profile(profile_update: ProfileUpdate):
    session = get_db()
    try:
        settings = session.exec(select(UserSettings).where(UserSettings.id == 1)).first()
        now = datetime.now().isoformat()
        
        if not settings:
            settings = UserSettings(id=1)
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
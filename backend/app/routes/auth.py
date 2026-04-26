import os
import re
from datetime import datetime, timedelta
from typing import Optional, Annotated

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, Field, field_validator
from sqlmodel import Session, select

from app.database import engine, User, UserSettings

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

router = APIRouter()
SECRET_KEY = os.environ.get("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7

EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")

def get_db():
    with Session(engine) as session:
        yield session

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": int(expire.timestamp())})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    session: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=401,
        detail="No se pudo validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = session.exec(select(User).where(User.email == email)).first()
    if user is None:
        raise credentials_exception
    return user

class UserCreate(BaseModel):
    email: str = Field(min_length=1)
    password: str = Field(min_length=8)
    username: Optional[str] = None

    @field_validator('email')
    @classmethod
    def validate_email(cls, v: str) -> str:
        if not v:
            raise ValueError('Email requerido')
        if not EMAIL_REGEX.match(v):
            raise ValueError('Email inválido')
        return v.lower()

    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError('Password debe tener al menos 8 caracteres')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password debe tener al menos una mayúscula')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password debe tener al menos una minúscula')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password debe tener al menos un número')
        return v

class UserResponse(BaseModel):
    id: int
    email: str
    username: Optional[str]

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/register", response_model=UserResponse)
def register(user_data: UserCreate, session: Session = Depends(get_db)):
    existing = session.exec(select(User).where(User.email == user_data.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="El email ya está registrado")

    password_hash = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        password_hash=password_hash,
        username=user_data.username or "Usuario",
        created_at=datetime.now().isoformat()
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    user_settings = UserSettings(
        user_id=new_user.id,
        username=user_data.username or "Usuario",
        email=user_data.email,
        salary=0,
        currency="COP",
        notifications_enabled=True,
        onboarding_completed=False,
        created_at=datetime.now().isoformat()
    )
    session.add(user_settings)
    session.commit()

    return new_user

@router.post("/login", response_model=TokenResponse)
def login(login_data: LoginRequest, session: Session = Depends(get_db)):
    user = session.exec(select(User).where(User.email == login_data.email)).first()
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email o password incorrecto")

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/logout")
def logout():
    return {"message": "Sesión cerrada"}
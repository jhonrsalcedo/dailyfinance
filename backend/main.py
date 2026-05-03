import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlmodel import SQLModel
from sqlalchemy.exc import IntegrityError
from contextlib import asynccontextmanager
from app.config import engine, create_db_and_tables
from app.seed import seed_database
from app.routes.auth import router as auth_router
from app.routes.transactions import router as transaction_router
from app.routes.categories import router as category_router
from app.routes.settings import router as settings_router
from app.routes.payment_methods import router as payment_methods_router
from app.routes.budget import router as budget_router
from app.routes.stats import router as stats_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Inicializando base de datos...")
    create_db_and_tables(engine)
    seed_database()
    print("DB lista con datos por defecto.")
    yield
    print("Apagando servicios...")

app = FastAPI(lifespan=lifespan)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Error de validación en los datos enviados",
            "errors": exc.errors(),
        },
    )

@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    logger.error(f"Value error: {exc}")
    return JSONResponse(
        status_code=400,
        content={
            "detail": str(exc) if str(exc) else "Error de validación",
        },
    )

@app.exception_handler(IntegrityError)
async def integrity_error_handler(request: Request, exc: IntegrityError):
    logger.error(f"Integrity error: {str(exc)}")
    return JSONResponse(
        status_code=409,
        content={
            "detail": "Conflicto de datos: el registro ya existe o viola restricciones",
        },
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {type(exc).__name__}: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Error interno del servidor",
        },
    )

@app.get("/health")
def health_check():
    return {"status": "healthy"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://dailyfinance-web.vercel.app",
        "https://*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1/auth")
app.include_router(transaction_router, prefix="/api/v1/transactions")
app.include_router(category_router, prefix="/api/v1/categories")
app.include_router(settings_router, prefix="/api/v1/settings")
app.include_router(payment_methods_router, prefix="/api/v1/payment-methods")
app.include_router(budget_router, prefix="/api/v1/budget")
app.include_router(stats_router, prefix="/api/v1/stats")

@app.get("/")
def read_root():
    return {"message": "Daily Finance API Running"}
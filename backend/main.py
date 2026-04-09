from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import engine, create_db_and_tables
from app.routes.transactions import router as transaction_router
from app.routes.categories import router as category_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Inicializando base de datos (SQLite localmente)...")
    create_db_and_tables(engine)
    print("DB lista.")
    yield
    print("Apagando servicios...")

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transaction_router, prefix="/api/v1/transactions")
app.include_router(category_router, prefix="/api/v1/categories")

@app.get("/")
def read_root():
    return {"message": "Daily Finance API Running"}
# skill: dailyfinance-backend.md
# Reglas para Backend (FastAPI + Python)

## Stack
- FastAPI
- SQLModel (ORM)
- Pydantic v2
- SQLite (desarrollo)

## Reglas de Código
- Sin punto y coma (estilo Python/PEP 8)
- Máximo 50 líneas por función/endpoint
- Type hints estrictos
- No usar comentarios en el código

## Modelos SQLModel
```python
from sqlmodel import Field, SQLModel

class Transaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    amount: float = Field(gt=0.0)
    category_id: Optional[int] = Field(default=None, foreign_key="category.id")
```

## Rutas
- Usar APIRouter con prefijo
- Depends para inyección de dependencias

## Conexión DB
- Usar Path para ruta absoluta de SQLite
- create_engine con echo=False

## Documentación
- Decisiones en LEARN_FastAPI.md
import pytest
from httpx import ASGITransport, AsyncClient
from main import app

@pytest.mark.asyncio
async def test_root_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Daily Finance API Running"}

@pytest.mark.asyncio
async def test_categories_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test", follow_redirects=True) as client:
        response = await client.get("/api/v1/categories")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_health_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

@pytest.mark.asyncio
async def test_get_transactions_requires_auth():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test", follow_redirects=True) as client:
        response = await client.get("/api/v1/transactions/")
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_get_stats_requires_auth():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/transactions/stats")
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_transactions_isolated_per_user():
    from app.database import User
    from app.config import engine
    from sqlmodel import Session, select
    from app.routes.auth import get_password_hash

    with Session(engine) as session:
        existing = session.exec(select(User).where(User.email == "isol.test@example.com")).first()
        if not existing:
            session.add(User(
                email="isol.test@example.com",
                password_hash=get_password_hash("IsolTest2026"),
                username="Isol",
                created_at="2026-01-01T00:00:00"
            ))
            session.commit()

        from app.database import Transaction
        for tx in session.exec(select(Transaction).where(Transaction.description == "Tx aislada")).all():
            session.delete(tx)
        session.commit()

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        login = await client.post("/api/v1/auth/login", json={
            "email": "isol.test@example.com",
            "password": "IsolTest2026"
        })
        token = login.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        created = await client.post("/api/v1/transactions/", headers=headers, json={
            "amount": 10000,
            "category_id": 2,
            "method_id": 1,
            "description": "Tx aislada",
            "date": "2026-08-22"
        })
        assert created.status_code == 200

        listed = await client.get("/api/v1/transactions/", headers=headers)
        assert listed.status_code == 200
        descriptions = [t["description"] for t in listed.json()]
        assert "Tx aislada" in descriptions
        assert len(listed.json()) == 1

@pytest.mark.asyncio
async def test_create_transaction_requires_auth():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {
            "amount": 50000,
            "category_id": 3,
            "method_id": 1,
            "description": "Test transaction",
            "date": "2026-04-24"
        }
        response = await client.post("/api/v1/transactions/", json=payload)
    assert response.status_code == 401

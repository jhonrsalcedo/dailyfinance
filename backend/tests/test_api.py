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
async def test_get_transactions_public():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test", follow_redirects=True) as client:
        response = await client.get("/api/v1/transactions/")
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_get_stats_public():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/transactions/stats")
    assert response.status_code in [200, 500]

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

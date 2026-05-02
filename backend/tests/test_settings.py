import pytest
from httpx import ASGITransport, AsyncClient
from main import app


@pytest.mark.asyncio
async def test_settings_endpoint_without_slash():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/settings", headers={"Authorization": "Bearer invalid"})
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_settings_endpoint_with_trailing_slash():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/settings/", headers={"Authorization": "Bearer invalid"})
    assert response.status_code == 200
    data = response.json()
    assert "currency" in data


@pytest.mark.asyncio
async def test_settings_returns_demo_user():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/settings/", headers={"Authorization": "Bearer invalid"})
    assert response.status_code == 200
    data = response.json()
    assert data["username"] in ["Demo", "Usuario"]


@pytest.mark.asyncio
async def test_settings_currency_default():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/settings/", headers={"Authorization": "Bearer invalid"})
    data = response.json()
    assert data.get("currency") == "COP"


@pytest.mark.asyncio
async def test_settings_profile_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/settings/profile", headers={"Authorization": "Bearer invalid"})
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_settings_onboarding_status():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/settings/onboarding-status", headers={"Authorization": "Bearer invalid"})
    assert response.status_code == 200
    data = response.json()
    assert "onboarding_completed" in data
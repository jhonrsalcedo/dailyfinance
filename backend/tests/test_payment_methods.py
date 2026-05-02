import pytest
from httpx import ASGITransport, AsyncClient
from main import app


@pytest.mark.asyncio
async def test_get_payment_methods():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test", follow_redirects=True) as client:
        response = await client.get("/api/v1/payment-methods")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_payment_methods_include_efectivo():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test", follow_redirects=True) as client:
        response = await client.get("/api/v1/payment-methods")
    methods = response.json()
    efectivo = [m for m in methods if m["name"] == "Efectivo"]
    assert len(efectivo) == 1
    assert efectivo[0]["type"] == "cash"


@pytest.mark.asyncio
async def test_payment_methods_include_tarjeta_debito():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test", follow_redirects=True) as client:
        response = await client.get("/api/v1/payment-methods")
    methods = response.json()
    debito = [m for m in methods if m["name"] == "Tarjeta Débito"]
    assert len(debito) == 1
    assert debito[0]["type"] == "debit"


@pytest.mark.asyncio
async def test_payment_methods_include_tarjeta_credito():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test", follow_redirects=True) as client:
        response = await client.get("/api/v1/payment-methods")
    methods = response.json()
    credito = [m for m in methods if m["name"] == "Tarjeta Crédito"]
    assert len(credito) == 1
    assert credito[0]["type"] == "credit"


@pytest.mark.asyncio
async def test_payment_methods_include_transferencias():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test", follow_redirects=True) as client:
        response = await client.get("/api/v1/payment-methods")
    methods = response.json()
    transferencias = [m for m in methods if m["name"] == "Transferencias"]
    assert len(transferencias) == 1
    assert transferencias[0]["type"] == "transfer"


@pytest.mark.asyncio
async def test_payment_methods_has_at_least_4_methods():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test", follow_redirects=True) as client:
        response = await client.get("/api/v1/payment-methods")
    methods = response.json()
    assert len(methods) >= 4


@pytest.mark.asyncio
async def test_payment_methods_have_valid_structure():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test", follow_redirects=True) as client:
        response = await client.get("/api/v1/payment-methods")
    methods = response.json()
    for method in methods:
        assert "id" in method
        assert "name" in method
        assert "type" in method
        assert isinstance(method["id"], int)
        assert isinstance(method["name"], str)
        assert isinstance(method["type"], str)
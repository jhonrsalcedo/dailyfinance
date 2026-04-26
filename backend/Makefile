.PHONY: venv install run test

venv:
	python3 -m venv .venv

install: venv
	.venv/bin/python -m pip install -r requirements.txt
	.venv/bin/python -m pip install pytest pytest-asyncio httpx

run:
	.venv/bin/python -m uvicorn main:app --reload

test:
	.venv/bin/python -m pytest -v

test-cov:
	.venv/bin/python -m pytest --cov=app --cov-report=html

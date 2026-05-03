.PHONY: venv install run run-dev run-prod test test-cov

# ============================================
# Setup
# ============================================
venv:
	python3 -m venv .venv

install: venv
	.venv/bin/python -m pip install -r requirements.txt
	.venv/bin/python -m pip install pytest pytest-asyncio httpx

# ============================================
# Run Development
# ============================================
run-dev: install
	@echo "Running in DEVELOPMENT mode..."
	@echo "Using Turso DB: $(DATABASE_URL)"
	.venv/bin/python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

# ============================================
# Run Production (simulated locally)
# ============================================
run-prod: install
	@echo "Running in PRODUCTION mode..."
	@echo "Using PostgreSQL: $(DATABASE_URL)"
	DATABASE_URL=$(DATABASE_URL) ENVIRONMENT=production \
	.venv/bin/python -m uvicorn main:app --host 0.0.0.0 --port 8000

# ============================================
# Run Default (development)
# ============================================
run: install
	.venv/bin/python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

# ============================================
# Testing
# ============================================
test:
	.venv/bin/python -m pytest -v

test-cov:
	.venv/bin/python -m pytest --cov=app --cov-report=html

# ============================================
# Usage Examples
# ============================================
help:
	@echo "Daily Finance App - Backend Commands"
	@echo ""
	@echo "make run-dev        Run in development mode (default, Turso)"
	@echo "make run-prod       Run in production mode (PostgreSQL)"
	@echo "make run           Run default (development)"
	@echo "make test         Run tests"
	@echo "make test-cov     Run tests with coverage"
	@echo ""
	@echo "Environment variables:"
	@echo "  DATABASE_URL      Database connection string"
	@echo "  TURSO_AUTH_TOKEN Auth token for Turso"
	@echo "  ENVIRONMENT      development | production"
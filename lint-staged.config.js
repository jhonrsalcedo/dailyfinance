module.exports = {
  'frontend/**/*.{ts,tsx}': [
    () => 'cd frontend && npm run lint',
    () => 'cd frontend && npm run typecheck',
    () => 'cd frontend && npm run test'
  ],
  'backend/**/*.py': [
    () => 'cd backend && source .venv/bin/activate && pytest',
    () => 'cd backend && source .venv/bin/activate && python -m pytest --cov=app --cov-report=term-missing'
  ],
  'frontend/**/*.json': [],
  '*.md': []
}

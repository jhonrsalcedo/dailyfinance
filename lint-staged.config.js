module.exports = {
  'frontend/**/*.{ts,tsx}': [
    () => 'cd frontend && npm run lint',
    () => 'cd frontend && npm run typecheck'
  ],
  'frontend/**/*.json': [],
  '*.md': []
}

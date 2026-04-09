# skill: dailyfinance-db.md
# Reglas para Base de Datos (SQLite)

## Estructura
- schema.sql: Definición de tablas
- seed.sql: Datos iniciales
- dailyfinance.db: Base de datos SQLite

## Tablas Principales
1. categories: Categorías de gastos (id, name, icon, color)
2. payment_methods: Métodos de pago (id, name, type)
3. transactions: Transacciones (id, amount, date, description, category_id, method_id)
4. monthly_budgets: Presupuestos (id, month, category_id, limit_amount)

## Foreign Keys
```sql
FOREIGN KEY (category_id) REFERENCES category(id)
FOREIGN KEY (method_id) REFERENCES paymentmethod(id)
```

## Categorías Predefinidas (del seed)
1. Ingresos
2. Vivienda
3. Transporte
4. Alimentación
5. Entretenimiento
6. Salud
7. Vehículo
8. Familia
9. Deudas/Crédito
10. Misceláneos

## Documentación
- Diseño y decisiones en LEARN_SQL.md
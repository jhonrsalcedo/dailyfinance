# LEARN_SQL.md
# Documentación de Diseño de Base de Datos (SQLite)

## 1. Modelo de Datos
El sistema requiere rastrear Transacciones, sus Categorías asociadas, y el Método de Pago utilizado.

### Tablas:

1.  **categories**: Maestros para clasificar gastos (Ej: 'Alimentación', 'Transporte').
    - **id**: PK.
    - **name**: Nombre único de la categoría.
    - **icon**: Nombre del icono (para el frontend).
    - **color**: Código de color (para gráficos).

2.  **payment_methods**: Métodos de pago (Ej: 'Efectivo', 'Tarjeta Débito').
    - **id**: PK.
    - **name**: Nombre del método.
    - **type**: Tipo general ('asset'/'liability').

3.  **transactions**: El registro central de cada movimiento.
    - **id**: PK.
    - **amount**: Valor (REAL para precisión decimal).
    - **date**: Fecha de la transacción (TEXT como ISO8601).
    - **description**: Detalle del gasto/ingreso.
    - **category_id**: FK a categories.
    - **method_id**: FK a payment_methods.

4.  **monthly_budgets**: Para proyecciones futuras (vacía inicialmente).
    - **id**: PK.
    - **month**: Mes y año (e.g., '2024-03').
    - **category_id**: FK a categories.
    - **limit_amount**: Límite presupuestado.

## 2. Relaciones (Foreign Keys)
- **transactions.category_id** 🡨 **categories.id** (Many-to-One)
- **transactions.method_id** 🡨 **payment_methods.id** (Many-to-One)

## 3. Importación CSV
El CSV de ejemplo muestra que los ingresos y egresos no están separados, sino que los ingresos son un valor positivo y los egresos negativos (o implícitos). Usaremos la columna 'amount' para esto, donde los gastos serán negativos o se inferirán por la ausencia de una categoría de Ingreso. Inicialmente, solo implementaremos el registro de GASTOS.
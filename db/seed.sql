-- db/seed.sql
-- Semilla inicial de datos basada en el CSV del usuario

-- 1. Payment Methods
INSERT INTO payment_methods (name, type) VALUES
('Efectivo', 'cash'),
('Tarjeta Débito', 'debit'),
('Tarjeta Crédito', 'credit');

-- 2. Categories (Inferidas del CSV)
INSERT INTO categories (name, icon, color) VALUES
('Ingresos', 'dollar-sign', '#22c55e'),      -- Verde
('Vivienda', 'home', '#3b82f6'),            -- Azul
('Transporte', 'car', '#f97316'),           -- Naranja
('Alimentación', 'shopping-cart', '#ef4444'), -- Rojo
('Entretenimiento', 'gamepad', '#a855f7'),  -- Púrpura
('Salud', 'stethoscope', '#14b8a6'),        -- Teal
('Vehículo', 'gas-pump', '#f59e0b'),        -- Ámbar
('Familia', 'users', '#ec4899'),            -- Rosa
('Deudas/Crédito', 'credit-card', '#64748b'), -- Gris
('Misceláneos', 'ellipsis', '#71717a');      -- Gris Oscuro

-- 3. Ejemplo de Transacción (Simulación de una entrada del CSV para probar el modelo)
-- Nota: Se requiere ejecutar el schema primero para que las FK existan.
-- Asumiendo: Ingresos ID=1, Alimentación ID=4, Efectivo ID=1
INSERT INTO transactions (amount, date, description, category_id, method_id) VALUES
(7878800.00, '2026-03-01', 'Sueldo Marzo', (SELECT id FROM categories WHERE name = 'Ingresos'), (SELECT id FROM payment_methods WHERE name = 'Tarjeta Débito')),
(-361166.00, '2026-03-02', 'Mercado Carnes Carulla', (SELECT id FROM categories WHERE name = 'Alimentación'), (SELECT id FROM payment_methods WHERE name = 'Tarjeta Crédito')),
(-1061868.00, '2026-03-05', 'Pago Cuota Apartamento', (SELECT id FROM categories WHERE name = 'Vivienda'), (SELECT id FROM payment_methods WHERE name = 'Tarjeta Débito')),
(-92236.00, '2026-03-06', 'Gasolina Picanto', (SELECT id FROM categories WHERE name = 'Transporte'), (SELECT id FROM payment_methods WHERE name = 'Tarjeta Crédito')),
(-50000.00, '2026-03-10', 'Retiro efectivo para mercado', (SELECT id FROM categories WHERE name = 'Alimentación'), (SELECT id FROM payment_methods WHERE name = 'Efectivo'));

-- 4. Budgets (Ejemplo: Presupuesto de Alimentación para Marzo 2026)
INSERT INTO monthly_budgets (month, category_id, limit_amount) VALUES
('2026-03', (SELECT id FROM categories WHERE name = 'Alimentación'), 1500000.00);
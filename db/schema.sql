-- db/schema.sql
-- Definición del esquema para SQLite

CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    icon TEXT,
    color TEXT
);

CREATE TABLE IF NOT EXISTS payment_methods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL -- e.g., 'debit', 'credit', 'cash'
);

CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL,
    date TEXT NOT NULL, -- Stored as ISO 8601 TEXT (YYYY-MM-DD)
    description TEXT,
    category_id INTEGER,
    method_id INTEGER,
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL,
    FOREIGN KEY (method_id) REFERENCES payment_methods (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS monthly_budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    month TEXT NOT NULL, -- Format YYYY-MM
    category_id INTEGER NOT NULL,
    limit_amount REAL NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE,
    UNIQUE (month, category_id)
);

CREATE TABLE IF NOT EXISTS user_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT DEFAULT 'Usuario',
    email TEXT,
    salary REAL,
    currency TEXT DEFAULT 'COP',
    theme TEXT DEFAULT 'light',
    notifications_enabled INTEGER DEFAULT 1,
    created_at TEXT,
    updated_at TEXT
);
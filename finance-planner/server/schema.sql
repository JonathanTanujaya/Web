-- Table for Users (if authentication is implemented later)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for Categories (e.g., Food, Transport, Salary)
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL -- 'income' or 'expense'
);

-- Table for Transactions
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    amount DECIMAL(15, 2) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'income' or 'expense'
    description TEXT,
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert some default categories (optional, but good for starting)
INSERT INTO categories (name, type) VALUES
    ('Salary', 'income'),
    ('Investments', 'income'),
    ('Food', 'expense'),
    ('Transport', 'expense'),
    ('Utilities', 'expense'),
    ('Rent', 'expense'),
    ('Entertainment', 'expense')
ON CONFLICT (name) DO NOTHING;

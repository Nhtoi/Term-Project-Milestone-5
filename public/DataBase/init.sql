CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    stock INTEGER NOT NULL
);

-- Insert sample data
INSERT INTO products (name, price, stock) VALUES
('Product A', 10.99, 100),
('Product B', 19.99, 50),
('Product C', 5.99, 200);

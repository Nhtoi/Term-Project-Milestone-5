-- Users Table
CREATE TABLE Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at DATETIME NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    user_type TEXT CHECK (user_type IN ('admin', 'shopper')) NOT NULL
);

-- Categories Table
CREATE TABLE Categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    priority_level INTEGER
);

-- Products Table
CREATE TABLE Products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    price REAL NOT NULL,
    category_id INTEGER,
    is_featured BOOLEAN DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES Categories(id)
);

-- Carts Table
CREATE TABLE Carts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    status TEXT CHECK (status IN ('new', 'abandoned', 'purchased')) NOT NULL,
    created_at DATETIME NOT NULL,
    user_id INTEGER UNIQUE,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- CartProducts Table
CREATE TABLE CartProducts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cart_id INTEGER,
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (cart_id) REFERENCES Carts(id),
    FOREIGN KEY (product_id) REFERENCES Products(id)
);

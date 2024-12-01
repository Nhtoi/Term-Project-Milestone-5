const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the database.');

        
        db.serialize(() => {
            db.run(`DROP TABLE IF EXISTS products;`);
            db.run(`
                CREATE TABLE IF NOT EXISTS products (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    price REAL NOT NULL,
                    description TEXT NOT NULL,
                    category TEXT NOT NULL,
                    image_path TEXT NOT NULL
                );
            `);

            
            const sql = `
                INSERT INTO products (name, price, description, category, image_path)
                VALUES (?, ?, ?, ?, ?)
            `;
            db.run(sql, [
                'Test Product',
                0.99,
                'This is a test item.',
                'Test Category',
                '../Assets/Product-Image.jpg',
            ]);

            
            db.run(`DROP TABLE IF EXISTS cart_items;`);
            db.run(`
                CREATE TABLE IF NOT EXISTS cart_items (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    product_id INTEGER NOT NULL,
                    name TEXT NOT NULL,
                    description TEXT NOT NULL,
                    price REAL NOT NULL,
                    quantity INTEGER NOT NULL,
                    FOREIGN KEY (product_id) REFERENCES products (id)
                );
            `, (err) => {
                if (err) {
                    console.error('Error creating cart_items table:', err.message);
                } else {
                    console.log('Cart items table is ready.');
                }
            });
        });
    }
});

module.exports = db;

const db = require('../models/db');

exports.addToCart = (req, res) => {
    const { id, name, description, price } = req.body;

    db.get(`SELECT * FROM cart_items WHERE product_id = ?`, [id], (err, row) => {
        if (err) {
            console.error('Error fetching cart item:', err.message);
            res.status(500).send('Internal Server Error');
        } else if (row) {
        
            const newQuantity = row.quantity + 1;
            db.run(`UPDATE cart_items SET quantity = ? WHERE product_id = ?`, [newQuantity, id], (err) => {
                if (err) {
                    console.error('Error updating cart item:', err.message);
                    res.status(500).send('Internal Server Error');
                } else {
                    res.redirect('/cart');
                }
            });
        } else {
            
            const sql = `
                INSERT INTO cart_items (product_id, name, description, price, quantity)
                VALUES (?, ?, ?, ?, ?)
            `;
            db.run(sql, [id, name, description, parseFloat(price), 1], (err) => {
                if (err) {
                    console.error('Error adding to cart:', err.message);
                    res.status(500).send('Internal Server Error');
                } else {
                    res.redirect('/cart');
                }
            });
        }
    });
};

exports.getCart = (req, res) => {
    db.all(`SELECT * FROM cart_items`, [], (err, rows) => {
        if (err) {
            console.error('Error fetching cart items:', err.message);
            res.status(500).send('Internal Server Error');
        } else {
            const total = rows.reduce((acc, item) => acc + item.price * item.quantity, 0);
            res.render('cart', { title: 'Your Shopping Cart', cart: rows, total: total.toFixed(2) });
        }
    });
};

exports.clearCart = (req, res) => {
    db.run(`DELETE FROM cart_items`, [], (err) => {
        if (err) {
            console.error('Error clearing cart:', err.message);
            res.status(500).send('Internal Server Error');
        } else {
            res.redirect('/cart');
        }
    });
};

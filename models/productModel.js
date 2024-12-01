const db = require('./db');
const productModel = require('../models/productModel');

const getAllProducts = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM products', [], (err, rows) => {
            if (err) {
                console.error('Error fetching products:', err.message);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

const getProductById = async (id) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
            console.log("Fetching product with ID:", id);
            if (err) {
                return reject(err);
            }
            resolve(row);
        });
    });
};


const createProduct = (name, price, category, description, image_path) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO products (name, price, category, description, image_path) VALUES (?, ?, ?, ?, ?)`;
        const params = [name, price, category, description, image_path];
        db.run(sql, params, function(err) {
            if (err) {
                return reject(err);
            }
            resolve({ message: 'Product created successfully' });
        });
    });
};

const updateProduct = (productId, name, description, category, price, imagePath) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE products SET name = ?, description = ?, category = ?, price = ?, image_path = ? WHERE id = ?`;
        const params = [name, description, category, price, imagePath, productId];

        db.run(sql, params, function (err) {
            if (err) {
                return reject(err);
            }
            resolve({ message: 'Product updated successfully' });
        });
    });
};

const deleteProduct = (productId) => {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM products WHERE id = ?`;
        db.run(sql, [productId], function (err) {
            if (err) {
                return reject(err);
            }
            resolve({ message: 'Product deleted successfully', changes: this.changes });
        });
    });
};

const saveProductChanges = async (req, res) => {
    console.log('Request body:', req.body);

    try {
        console.log('Request body:', req.body); 

        const { productId, productName, productDescription, category, price, image_path } = req.body;

        if (!productId || !productName || !productDescription || !category || !price || !image_path) {
            throw new Error('All fields are required');
        }

        
        await productModel.updateProduct(productId, productName, productDescription, category, price, image_path);

        res.redirect('/admin/products');
    } catch (err) {
        console.log('Update parameters:', productId, productName, productDescription, category, price, image_path);
        console.error('Error saving product:', err);
        res.status(500).send('Error saving product');
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    saveProductChanges,
};

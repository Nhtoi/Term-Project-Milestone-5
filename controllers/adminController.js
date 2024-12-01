const productModel = require('../models/productModel');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });

const getBulkUploadPage = (req, res) => {
    res.render('admin-upload', { title: 'Admin - Bulk Upload' });
};
const handleBulkUpload = (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const filePath = path.join(__dirname, '../uploads', req.file.filename);
    const originalName = req.file.originalname.toLowerCase();

    if (originalName.endsWith('.json')) {
        
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Error reading JSON file.');
            }
            const products = JSON.parse(data);
            insertProducts(products, res);
        });
    } else if (originalName.endsWith('.csv')) {
      
        const products = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                if (row.name && row.price && row.category) {
                    products.push({
                        name: row.name,
                        description: row.description,
                        category: row.category,
                        price: parseFloat(row.price),
                        image_path: row.image_path,
                    });
                }
            })
            .on('end', () => {
                insertProducts(products, res);
            });
    } else {
        res.status(400).send('Unsupported file format. Only JSON and CSV are allowed.');
    }
};

const insertProducts = (products, res) => {
    if (!products.length) {
        return res.status(400).send('No valid product data found in the file.');
    }

    products.forEach((product) => {
        productModel.createProduct(product.name, product.price, product.category, product.description, product.image_path)
            .then(() => {
                console.log('Product inserted:', product.name);
            })
            .catch((err) => {
                console.error('Error inserting product:', err);
            });
    });

    res.redirect('/admin/products');
};


const getAdminProducts = async (req, res) => {
    try {
        const products = await productModel.getAllProducts();
        console.log('Products fetched:', products);
        res.render('admin-products', { products, title: 'Admin - Products' });
    } catch (err) {
        console.error('Error fetching admin products:', err);
        res.status(500).send('Internal server error');
    }
};

const getEditProductPage = async (req, res) => {
    try {
        const product = await productModel.getProductById(req.params.id);
        console.log("Product fetched for editing:", product);
        if (product) {
            res.render('product-edit', { product, title: 'Edit Product' });
        } else {
            res.status(404).send('Product not found');
        }
    } catch (err) {
        console.error('Error fetching product for editing:', err);
        res.status(500).send('Error editing product');
    }
};


const saveProductChanges = async (req, res) => {
    console.log('Request body:', req.body);

    try {
        const { productId, productName, productDescription, category, price, image_path } = req.body;

     
        await productModel.updateProduct(productId, productName, productDescription, category, price, image_path);

       
        res.redirect('/admin/products');
    } catch (err) {
        console.error('Error saving product:', err);
        res.status(500).send('Error saving product');
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        console.log('Deleting product with ID:', id);
        const result = await productModel.deleteProduct(id);

        if (result.changes > 0) {
            console.log('Product deleted successfully.');
            res.redirect('/admin/products'); 
        } else {
            console.log('No product found with the given ID.');
            res.status(404).send('Product not found.');
        }
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).send('Error deleting product.');
    }
};


module.exports = {
    getAdminProducts,
    getBulkUploadPage,
    handleBulkUpload,
    getEditProductPage,
    saveProductChanges,
    deleteProduct,
};

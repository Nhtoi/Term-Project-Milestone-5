const productModel = require('../models/productModel');

exports.getProducts = async (req, res) => {
    try {
        const products = await productModel.getAllProducts(); 
        res.render('products', { title: 'Products', products });
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).send('Error retrieving products');
    }
};

exports.getProductDetails = async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await productModel.getProductById(productId); 
        if (product) {
            res.render('details', { title: 'Product Details', product }); 
        } else {
            res.status(404).send('Product not found');
        }
    } catch (err) {
        console.error('Error fetching product details:', err);
        res.status(500).send('Error retrieving product details');
    }
};


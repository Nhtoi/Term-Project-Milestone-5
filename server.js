const express = require('express');
const path = require('path');

const productRoutes = require('./routes/productRoutes'); 
const adminRoutes = require('./routes/adminRoutes'); 
const cartRoutes = require('./routes/cartRoutes');
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));


app.use('/', productRoutes);
app.use('/admin', adminRoutes);
app.use(cartRoutes);


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

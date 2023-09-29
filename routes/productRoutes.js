const express = require('express');
const productController = require('../controllers/productController');

const Router = express.Router();

Router.post('/create', productController.createProduct);

Router.get('/all', productController.getAllProducts);

Router.get('/:id', productController.getProductById);

Router.put('/:id', productController.updateProductById);

Router.delete('/:id', productController.deleteProductById);

module.exports = Router;

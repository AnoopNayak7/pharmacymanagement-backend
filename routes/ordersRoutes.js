const express = require('express');
const orderController = require('../controllers/ordersController');

const Router = express.Router();

Router.post('/create', orderController.createOrder);

Router.get('/all', orderController.getOrders);

Router.get('/:id', orderController.getOrderById);

Router.get('/user/:userId', orderController.getOrdersByUserId);

module.exports = Router;

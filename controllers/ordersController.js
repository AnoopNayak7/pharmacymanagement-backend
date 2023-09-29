const Order = require('../models/ordersModal');
const productModal = require('../models/productModal');

const orderController = {
  createOrder: async (req, res) => {
    try {
      const {
        products,
        totalAmount,
        customerName,
        customerEmail,
        userId
      } = req.body;

      const newOrder = new Order({
        products,
        totalAmount,
        customerName,
        customerEmail,
        userId
      });

      const savedOrder = await newOrder.save();

      for (const product of products) {
        const productId = product.product;
        const quantityOrdered = product.quantity;

        const existingProduct = await productModal.findById(productId);

        if (existingProduct) {
          const newStock = existingProduct.stock - quantityOrdered;

          await productModal.findByIdAndUpdate(productId, { stock: newStock });
        }
      }

      res.status(201).json({
        success: true,
        msg: 'Order created successfully',
        data: savedOrder,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        msg: 'Failed to create order',
        error: err.message,
      });
    }
  },

  getOrdersByUserId: async (req, res) => {
    try {
      const userId = req.user.id;

      const orders = await Order.find({ userId }).populate('products.product');

      res.status(200).json({
        success: true,
        msg: 'Fetched user orders successfully',
        data: orders,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        msg: 'Failed to fetch orders',
        error: err.message,
      });
    }
  },

  getOrders: async (req, res) => {
    try {
      const orders = await Order.find().populate('products.product');

      res.status(200).json({
        success: true,
        msg: 'Fetched all orders successfully',
        data: orders,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        msg: 'Failed to fetch orders',
        error: err.message,
      });
    }
  },

  getOrderById: async (req, res) => {
    try {
      const orderId = req.params.id;
      const order = await Order.findById(orderId).populate('products.product');

      if (!order) {
        return res.status(404).json({
          success: false,
          msg: 'Order not found',
        });
      }

      res.status(200).json({
        success: true,
        msg: 'Fetched order successfully',
        data: order,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        msg: 'Failed to fetch order',
        error: err.message,
      });
    }
  },
};

module.exports = orderController;

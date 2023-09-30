const Product = require('../models/productModal');

const productController = {
  createProduct: async (req, res) => {
    try {
      const {
        name,
        description,
        manufacturer,
        dosage,
        price,
        stock,
        expirationDate,
      } = req.body;

      const newProduct = new Product({
        name,
        description,
        manufacturer,
        dosage,
        price,
        stock,
        expirationDate,
      });

      await newProduct.save();

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: newProduct,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: err.message,
      });
    }
  },

  getAllProducts: async (req, res) => {
    try {
      const searchTerm = req.query.searchTerm;
      let products;

      if (searchTerm) {
          products = await Product.find({
              $or: [
                  { name: { $regex: new RegExp(searchTerm, 'i') } },
                  { description: { $regex: new RegExp(searchTerm, 'i') } },
              ],
          });
      } else {
          products = await Product.find();
      }

      res.status(200).json({
          success: true,
          message: 'Products fetched successfully',
          count: products.length,
          data: products,
      });
  } catch (err) {
      res.status(500).json({
          success: false,
          message: 'Internal Server Error',
          error: err.message,
      });
  }
  },

  getProductById: async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }
      res.status(200).json({
        success: true,
        message: 'Product found',
        data: product,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: err.message,
      });
    }
  },

  updateProductById: async (req, res) => {
    try {
      const productId = req.params.id;
      const updatedData = req.body;
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        updatedData,
        { new: true }
      );
      if (!updatedProduct) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }
      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: err.message,
      });
    }
  },

  deleteProductById: async (req, res) => {
    try {
      const productId = req.params.id;
      const deletedProduct = await Product.findByIdAndDelete(productId);
      if (!deletedProduct) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }
      res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
        data: deletedProduct,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: err.message,
      });
    }
  },
};

module.exports = productController;

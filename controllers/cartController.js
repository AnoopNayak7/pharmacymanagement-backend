const CartItem = require('../models/cartModal');

const cartController = {
  addToCart: async (req, res) => {
    try {
      const { productId, quantity } = req.body.productItems[0];
      const userId = req.body.userId;

      console.log(req.body, productId, quantity)

      let cartItem = await CartItem.findOne({ 'productItems.productId': productId, userId });

      console.log(cartItem)

      if (cartItem) {
        const productIndex = cartItem.productItems.findIndex((item) => item.productId === productId);
        cartItem.productItems[productIndex].quantity += quantity;
      } else {
        cartItem = new CartItem({
          userId,
          productItems: [{ productId, quantity }],
        });
      }

      await cartItem.save();

      res.status(201).json({
        success: true,
        message: 'Item added to cart successfully',
        data: cartItem,
      });
    } catch (error) {
        console.log('RRRRRR', error)
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  },

  removeFromCart: async (req, res) => {
    try {
      const itemId = req.params.itemId;
      const userId = req.user._id;

      const cartItem = await CartItem.findOne({ userId });

      if (!cartItem) {
        return res.status(404).json({
          success: false,
          message: 'Cart not found',
        });
      }

      const updatedProductItems = cartItem.productItems.filter(
        (item) => item._id.toString() !== itemId
      );

      cartItem.productItems = updatedProductItems;
      await cartItem.save();

      res.status(204).send();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  },

  updateCartItemQuantity: async (req, res) => {
    try {
      const itemId = req.params.itemId;
      const { quantity } = req.body;
      const userId = req.user._id;

      const cartItem = await CartItem.findOne({ userId });

      if (!cartItem) {
        return res.status(404).json({
          success: false,
          message: 'Cart not found',
        });
      }

      const productIndex = cartItem.productItems.findIndex(
        (item) => item._id.toString() === itemId
      );

      if (productIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Item not found in the cart',
        });
      }

      cartItem.productItems[productIndex].quantity = quantity;
      await cartItem.save();

      res.status(200).json({
        success: true,
        message: 'Cart item quantity updated successfully',
        data: cartItem,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  },
};

module.exports = cartController;

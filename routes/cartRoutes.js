const express = require('express');
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware'); 

const router = express.Router();

// router.use(authMiddleware);

router.post('/add', cartController.addToCart);

router.delete('/remove/:itemId', cartController.removeFromCart);

router.put('/update/:itemId', cartController.updateCartItemQuantity);

module.exports = router;

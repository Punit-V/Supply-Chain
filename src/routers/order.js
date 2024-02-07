const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/order');
const auth = require("../middleware/auth")

// Endpoint to create an order
router.post('/createOrder',auth, ordersController.createOrder);

// Endpoint to delete an order
router.delete('/deleteOrder/:orderId', auth,ordersController.deleteOrder);

module.exports = router;

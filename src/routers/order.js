const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/order');

// Endpoint to create an order
router.post('/create', ordersController.createOrder);

// Endpoint to delete an order
router.delete('/delete/:orderId', ordersController.deleteOrder);

module.exports = router;

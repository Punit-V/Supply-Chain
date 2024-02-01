const express = require('express');
const router = express.Router();
const shipmentsController = require('../controllers/shipment');

// Endpoint to create a shipment
router.post('/create', shipmentsController.createShipment);

// Endpoint to update shipment status
router.post('/update', shipmentsController.updateShipmentStatus);

module.exports = router;

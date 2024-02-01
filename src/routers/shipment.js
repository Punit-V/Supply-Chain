const express = require('express');
const router = express.Router();
const shipmentsController = require('../controllers/shipment');
const auth = require("../middleware/auth")

// Endpoint to create a shipment
router.post('/create', auth,shipmentsController.createShipment);

// Endpoint to update shipment status
router.post('/update', auth,shipmentsController.updateShipmentStatus);

module.exports = router;

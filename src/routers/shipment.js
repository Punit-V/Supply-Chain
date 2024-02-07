const express = require('express');
const router = express.Router();
const shipmentsController = require('../controllers/shipment');
const auth = require("../middleware/auth")

// Endpoint to create a shipment
router.post('/createShipment', auth,shipmentsController.createShipment);

// Endpoint to update shipment status
router.patch('/updateShipment', auth,shipmentsController.updateShipmentStatus);

module.exports = router;

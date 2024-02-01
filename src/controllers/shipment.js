const db = require('../db/dbconfig')
const Shipments = db.shipments
const Orders = db.orders;

// Endpoint to create a shipment
const createShipment = async (req, res) => {
  try {
    const {  orderId, destination, shipmentDate, expectedDelivery } = req.body;

    const order = await Orders.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }


    // Create a new shipment
    const newShipment = await Shipments.create({
      orderId: orderId,
      destination: destination,
      shipment_date: shipmentDate,
      expected_delivery: expectedDelivery,
      status: 'In Transit', // Initial status
      current_location: 'Warehouse', // Initial location
    });

    // Store the tracking ID for future reference
    const trackingId = newShipment.id;

    res.status(201).json({ message: 'Shipment created', trackingId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const updateShipmentStatus = async (req, res) => {
    try {
      const { trackingId, currentLocation, status } = req.body;

      if (!trackingId) {
        return res.status(400).json({ error: 'Tracking ID is required for the update' });
      }
  
      // Check if at least one field is present in the request
      if (!currentLocation && !status ) {
        return res.status(400).json({ error: 'At least one field (currentLocation or status) is required for the update' });
      }
  
      const updateFields = {};
  
      // Update current_location if present in the request
      if (currentLocation) {
        updateFields.current_location = currentLocation;
      }
  
      // Update status if present in the request
      if (status) {
        updateFields.status = status;
      }
  
      // Find the shipment by tracking ID and update specified fields
      const [affectedRowsCount] = await Shipments.update(
        updateFields,
        { where: { id: trackingId } }
      );
  
      if (affectedRowsCount > 0) {
        res.status(200).json({ message: 'Shipment updated successfully' });
      } else {
        res.status(404).json({ error: 'Shipment not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  
module.exports = {
  createShipment,
  updateShipmentStatus,
};




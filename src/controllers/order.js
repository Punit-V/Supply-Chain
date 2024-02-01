const db = require('../db/dbconfig')
const Inventory = db.inventory;
const Orders = db.orders;



// Endpoint to create an order
const createOrder = async (req, res) => {

    if(!req.user){
        res.status(400).json({ error: 'please authenticate' });
    }
  try {

    const { user_id, order_date, item_code, item_name, quantity } = req.body;

    // Calculate total value based on item's price from inventory
    const totalValue = await calculateTotalValue(item_code, quantity);

    // Create the order
    const newOrder = await Orders.create({
      user_id,
      order_date,
      item_code,
      item_name,
      quantity,
      total_value: totalValue,
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Endpoint to delete an order
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order by ID and delete it
    const deletedOrder = await Orders.destroy({
      where: { user_id: orderId },
    });

    if (deletedOrder) {
      res.status(200).json({ message: 'Order deleted successfully' });
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Function to calculate the total value of an order
const calculateTotalValue = async (itemCode, quantity) => {
    try {
      const item = await Inventory.findOne({
        where: { id: itemCode },
        attributes: ['price'],
      });
  
      if (!item) {
        throw new Error('Item not found in inventory');
      }
  
      const totalValue = item.price * quantity;
      return totalValue;
    } catch (error) {
      throw error;
    }
  };
  

module.exports = {
  createOrder,
  deleteOrder,
};
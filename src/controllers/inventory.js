const db = require('../db/dbconfig')
const Inventory = db.inventory

// Endpoint to add an item to the inventory
const addItem = async (req, res) => {
     
  if(req.user.role === "staff" || !req.user )
  {
    return res.status(401).send({ error: "Please authenticate as a manager." });
  }
  try {
    const { item_name, quantity, price, supplier } = req.body;

    // Create a new item in the inventory
    const newItem = await Inventory.create({ item_name, quantity, price, supplier });

    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Endpoint to list all items in the inventory
const listItems = async (req, res) => {
     
  if(req.user.role === "staff" || !req.user )
  {
    return res.status(401).send({ error: "Please authenticate as a manager." });
  }
  try {
    const allItems = await Inventory.findAll();

    res.status(200).json(allItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Endpoint to delete a specific item from the inventory
const deleteItem = async (req, res) => {
     
  if(req.user.role === "staff" || !req.user )
  {
    return res.status(401).send({ error: "Please authenticate as a manager." });
  }
  try {
    const { itemId } = req.params;

    // Find the item by ID and delete it
    const deletedItem = await Inventory.destroy({
      where: { item_id: itemId },
    });

    if (deletedItem) {
      res.status(200).json({ message: 'Item deleted successfully' });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  addItem,
  listItems,
  deleteItem,
};

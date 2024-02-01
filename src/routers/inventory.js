const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory');

// Endpoint to add an item to the inventory
router.post('/add', inventoryController.addItem);

// Endpoint to list all items in the inventory
router.get('/list', inventoryController.listItems);

// Endpoint to delete a specific item from the inventory
router.delete('/delete/:itemId', inventoryController.deleteItem);

module.exports = router;

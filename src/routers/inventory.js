const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory');
const auth = require("../middleware/auth")

// Endpoint to add an item to the inventory
router.post('/add',auth, inventoryController.addItem);

// Endpoint to list all items in the inventory
router.get('/list',auth, inventoryController.listItems);

// Endpoint to delete a specific item from the inventory
router.delete('/delete/:itemId',auth, inventoryController.deleteItem);

module.exports = router;

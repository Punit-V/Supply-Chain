const express = require("express")
const router = express.Router();
const auth = require("../middleware/auth");
const userController = require("../controllers/user");

// Create User 
router.post("/registerUser", auth , userController.createUser);

// Login User 
router.post("/loginUser", userController.loginUser);

// Logout User 
router.post("/logoutUser", auth, userController.logoutUser);

// Read User Profile 
router.get("/readUser", auth, userController.readUserProfile);

// Update User Profile 
router.patch("/updateUser", auth, userController.updateUserProfile);

// Delete User Profile \\
router.delete("/deleteUser", auth, userController.deleteUserProfile);

module.exports = router;

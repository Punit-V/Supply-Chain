const db = require("../db/dbconfig");

const Users = db.users;

// Create Users \\
const createUser = async (req, res) => {


  const existingUsersCount = await Users.count();
    
  if (existingUsersCount > 0) {
    const user = req.user;
    if (!user || user.getDataValue("role") !== "Manager") {
      return res.status(401).send({ error: "Please authenticate as a manager!" });
    }
  }

  const { username, email, password , role, department} = req.body;

  // Check if any required attribute is missing
  if (!username || !email || !password || !role || !department) {
    return res.status(400).send({ error: 'Please provide username, email, password, role, and department.' });
}



let info = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    department: req.body.department,
};

  try {
    const user = await Users.create(info);
    const token = await user.generateAuthToken();

    res.status(201).send({ user, token });
  } catch (error) {
    // Check for specific errors and handle accordingly
    if (error.code === 11000) {
      // Duplicate key error (e.g., duplicate email)
      res.status(400).send({ error: 'Email is already in use.' });
    } else {
      // Other errors
      console.error(error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
}
};

// Login Users \\
const loginUser = async (req, res) => {
  try {
    const user = await Users.findByCredentials(
      req.body.email,
      req.body.password
    );

    if (!user) {
    
      return res.status(401).send({ error: "Invalid email or password." });
    }
    const token = await user.generateAuthToken();

    
    if(!token)
    {
      return res.status(401).send({ error: "Unable to generate token." });
    }

    res.status(200).send({ user, token });
  } catch (e) {
    res.status(400).send({ error: "Oops, Something went wrong !!" });
  }
};

// Logout Users \\
const logoutUser = async (req, res) => {
  try {
    const userTokens = JSON.parse(req.user.tokens);

    req.user.tokens = JSON.stringify(
      userTokens.filter((tokenObj) => tokenObj.token !== req.token)
    );

    await req.user.save();

    res.status(200).send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
};

// Read Users Profile \\
const readUserProfile = async (req, res) => {

  res.status(200).send(req.user);

  
};

// Update Users Profile \\
const updateUserProfile = async (req, res) => {

  
  if(req.user.role === "staff" || !req.user )
  {
    return res.status(401).send({ error: "Please authenticate as a manager." });
  }
    const updates = Object.keys(req.body);
    const allowedUpdates = ["username", "email", "password", "role", "department"];
    const isValid = updates.every((item) => allowedUpdates.includes(item));

    if (!updates.length > 0 || !isValid) {
        return res.status(400).send({ error: "Not a valid property to update !!" });
    }

  try {
   
      updates.forEach((item) => (req.user[item] = req.body[item]));

      await req.user.save();
  
      res.status(200).send(req.user);
  
    
  } catch (e) {
    res.status(400).send(e);
  }
};


// Delete Users Profile \\
const deleteUserProfile = async (req, res) => {
    
  if(req.user.role === "staff" || !req.user )
  {
    return res.status(401).send({ error: "Please authenticate as a manager." });
  }
  try {

    await req.user.destroy();

    res.status(200).send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
};

module.exports = {
  createUser,
  loginUser,
  logoutUser,
  readUserProfile,
  updateUserProfile,
  deleteUserProfile,
};

const sharp = require("sharp");
const db = require("../db/dbconfig");

// Create main model \\
const Users = db.users;

// Create Users \\
const createUser = async (req, res) => {
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
  if(!req.user)
  {
    return res.status(401).send({ error: "Please authenticate as a user." });
  }

  res.status(200).send(req.user);
};

// Update Users Profile \\
const updateUserProfile = async (req, res) => {
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

// Upload Users Profile Picture \\
const uploadUserProfilePicture = async (req, res) => {
  try {
    if (!req.file.buffer) {
      return res.status(404).send({ error: "Please select an image file!!" });
    }

    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();

    req.user.avatar = buffer;

    await req.user.save();

    res.status(200).send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
};

// Display Users Profile Picture \\
const displayUserProfilePicture = async (req, res) => {
  try {
    const user = await Users.findByPk(req.user.id);

    if (!user || !user.avatar) {
      throw new Error("Oops, Something went wrong !!");
    }

    res.set("Content-Type", "image/png");

    res.status(200).send(user.avatar);
  } catch (e) {
    res.status(404).send({ error: "Oops, Something went wrong !!" });
  }
};

// Delete Users Profile Picture \\
const deleteUserProfilePicture = async (req, res) => {
  try {
    req.user.avatar = null;

    await req.user.save();

    res.status(200).send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
};

// Delete Users Profile \\
const deleteUserProfile = async (req, res) => {
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
  uploadUserProfilePicture,
  displayUserProfilePicture,
  deleteUserProfilePicture,
  deleteUserProfile,
};

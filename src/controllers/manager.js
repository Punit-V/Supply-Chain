const sharp = require("sharp");
const db = require("../db/dbconfig");

// Create model \\
const Managers = db.managers;

// Create Manager \\
const createManager = async (req, res) => {
    const { username, email, password, role, department } = req.body;

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
        const manager = await Managers.create(info);
        const token = await manager.generateAuthToken();

        res.status(201).send({ manager, token });
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

// Login Manager \\
const loginManager = async (req, res) => {
    try {
        const manager = await Managers.findByCredentials(
            req.body.email,
            req.body.password
        );

        if (!manager) {
            return res.status(401).send({ error: "Invalid email or password." });
        }

        const token = await manager.generateAuthToken();

        if (!token) {
            return res.status(401).send({ error: "Unable to generate token." });
        }

        res.status(200).send({ manager, token });
    } catch (e) {
        res.status(400).send({ error: "Oops, Something went wrong !!" });
    }
};

// Logout Managers \\
const logoutManager = async (req, res) => {
    try {
        const userTokens = JSON.parse(req.manager.tokens);

        req.manager.tokens = JSON.stringify(
            userTokens.filter((tokenObj) => tokenObj.token !== req.token)
        );

        await req.manager.save();

        res.status(200).send(req.manager);
    } catch (e) {
        res.status(500).send(e);
    }
};

// Read Manager Profile \\
const readManagerProfile = async (req, res) => {
    if (!req.manager) {
        return res.status(401).send({ error: "Please authenticate as a manager." });
    }

    res.status(200).send(req.manager);
};

// Update Manager Profile \\
const updateManagerProfile = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["username", "email", "password", "role", "department"];
    const isValid = updates.every((item) => allowedUpdates.includes(item));

    if (!updates.length > 0 || !isValid) {
        return res.status(400).send({ error: "Not a valid property to update !!" });
    }

    try {
        updates.forEach((item) => (req.manager[item] = req.body[item]));

        await req.manager.save();

        res.status(200).send(req.manager);
    } catch (e) {
        res.status(400).send(e);
    }
};

// Upload Manager Profile Picture \\
const uploadManagerProfilePicture = async (req, res) => {
    try {
        if (!req.file.buffer) {
            return res.status(404).send({ error: "Please select an image file!!" });
        }

        const buffer = await sharp(req.file.buffer)
            .resize({ width: 250, height: 250 })
            .png()
            .toBuffer();

        req.manager.avatar = buffer;

        await req.manager.save();

        res.status(200).send(req.manager);
    } catch (e) {
        res.status(400).send(e);
    }
};

// Display Managers Profile Picture \\
const displayManagerProfilePicture = async (req, res) => {
    try {
        const manager = await Managers.findByPk(req.manager.id);

        if (!manager || !manager.avatar) {
            throw new Error("Oops, No such user is found OR User does not have a profile picture!!");
        }

        res.set("Content-Type", "image/png");

        res.status(200).send(manager.avatar);
    } catch (e) {
        res.status(404).send({ error: "Oops, Something went wrong !!" });
    }
};

// Delete Manager Profile Picture \\
const deleteManagerProfilePicture = async (req, res) => {
    try {
        req.manager.avatar = null;

        await req.manager.save();

        res.status(200).send(req.manager);
    } catch (e) {
        res.status(400).send(e);
    }
};

// Delete Manager Profile \\
const deleteManagerProfile = async (req, res) => {
    try {
        await req.manager.destroy();

        res.status(200).send(req.manager);
    } catch (e) {
        res.status(500).send(e);
    }
};

module.exports = {
    createManager,
    loginManager,
    logoutManager,
    readManagerProfile,
    updateManagerProfile,
    uploadManagerProfilePicture,
    displayManagerProfilePicture,
    deleteManagerProfilePicture,
    deleteManagerProfile,
};

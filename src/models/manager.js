const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
    const Managers = sequelize.define("managers", {
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
            set(email) {
                this.setDataValue("email", email.toLowerCase());
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isLongEnough(value) {
                    if (value.length < 8) {
                        throw new Error("Password should be at least 8 characters long!!");
                    }
                },
                isNotPassword(value) {
                    if (value.toLowerCase() === "password") {
                        throw new Error('Password cannot be "password"');
                    }
                },
            },
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['staff', 'manager']], // Role should be either 'staff' or 'manager'
            },
        },
        department: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        tokens: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: "[]",
            get() {
                const tokensString = this.getDataValue("tokens");
                return JSON.parse(tokensString);
            },
            set(value) {
                this.setDataValue("tokens", JSON.stringify(value));
            },
        }
    });

    // changing values before creating
    Managers.beforeCreate(async (manager) => {
        manager.username = manager.username.trim();
        manager.password = await bcrypt.hash(manager.password.trim(), 8);
        manager.tokens = JSON.stringify([]);
    });

    // changing values before updating
    Managers.beforeUpdate(async (manager) => {
        if (manager.changed('username')) {
            manager.username = manager.username.trim();
        }
        if (manager.changed('password')) {
            manager.password = await bcrypt.hash(manager.password.trim(), 8);
        }
    });

    // Instance method to generate auth token
    Managers.prototype.generateAuthToken = async function () {
        const manager = this;
        const token = jwt.sign({ id: manager.id.toString(), userType: "manager" }, process.env.JWT_SECRET);

        // Get the current tokens as an array
        let tokens = JSON.parse(manager.tokens || "[]");

        // Add a new token object
        tokens.push({ token });

        // Update the 'tokens' field with the updated array by serializing it back to a string
        manager.tokens = JSON.stringify(tokens);

        // Save the updated tokens back to the database
        await manager.save();

        return token;
    };

    // class methods
    Managers.findByCredentials = async function (email, password) {
        const manager = await Managers.findOne({ where: { email: email } });

        if (!manager) {
            throw new Error("Unable to login!!");
        }

        const isMatch = await bcrypt.compare(password, manager.password);

        if (!isMatch) {
            throw new Error("Unable to login!!");
        }

        return manager;
    };

    Managers.prototype.toJSON = function () {
        const values = { ...this.get() };

        delete values.password;
        delete values.tokens;
  

        return values;
    };

    return Managers;
};

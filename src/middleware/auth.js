
const jwt = require("jsonwebtoken");
const db = require('../db/dbconfig');

const Users = db.users;
const Managers = db.managers;

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
 
    if (decoded.userType == "manager") {

      const manager = await Managers.findOne({
        where: {
          id: decoded.id
        }
      });

      if (!manager) {
        throw new Error("manager not found");
      }

      const managerTokens = JSON.parse(manager.tokens);

      const tokenExists = managerTokens.some(
        (managerToken) => managerToken.token === token
      );

      if (!tokenExists) {
        throw new Error();
      }

      req.token = token
      req.manager = manager;
    
    }


    if (decoded.userType == "user") {

      const user = await Users.findOne({
        where: {
          id: decoded.id,
          
        }
      });

      
      if (!user) {
        throw new Error("User not found");

      }

      const userTokens = JSON.parse(user.tokens);

      const tokenExists = userTokens.some(
        (userToken) => userToken.token === token
      );

      if (!tokenExists) {
        throw new Error();
      }

      req.token = token
      req.user = user


    }

    next();




  } catch (e) {
    res.status(400).send("Please authenticate !!");
  }
};

module.exports = auth;

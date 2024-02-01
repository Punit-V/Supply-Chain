
const jwt = require("jsonwebtoken");
const db = require('../db/dbconfig');

const Users = db.users;

const auth = async (req, res, next) => {
  try {
    const existingUsersCount = await Users.count();
   
    if (existingUsersCount === 0 && req.body.role === "Manager") {
      next();
      
    }

    const token = req.header("Authorization").replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
 
   
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
    


    next();




  } catch (e) {
    res.status(400).send("Please authenticate !!");
  }
};

module.exports = auth;

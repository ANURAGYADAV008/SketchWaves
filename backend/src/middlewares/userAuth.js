require("dotenv").config();
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.cookies?.token; 

    if (!token) throw new Error("Token is not valid");

    const decodedmessage = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decodedmessage._id);
    if (!user) throw new Error("User Not Found");

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ message: error.message });
  }
};

module.exports={userAuth}
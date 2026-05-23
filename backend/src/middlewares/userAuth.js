require("dotenv").config();
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) throw new Error("Token is Not Valid");

        const decodedmessage = await jwt.verify(token, process.env.SECRET_KEY);

        const { _id } = decodedmessage;
        const user = await User.findOne({ _id: _id });
        if (!user) throw new Error("User Not Found");
        //console.log("User is",user);
        req.user = user;
        // for Mongoose

        next();
    }
    catch (error) {
        res.status(401).send({ message: error.message });
    }


}
module.exports = { userAuth };
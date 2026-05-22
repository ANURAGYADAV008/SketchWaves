const express = require("express");
const authRouter = express.Router();
const { User } = require("../models/user");
const { validateSignup } = require("../utils/validation");
const bcrypt = require("bcryptjs");
const { userAuth } = require("../middlewares/userAuth")

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        console.log("User data is", req.body);
        if (!emailId || !password) throw new Error("All fields are required");

        const user = await User.findOne({ emailId: emailId.trim().toLowerCase() });

        if (!user) throw new Error("User Not found");

        const isPasswordValidate = await user.getValidatePassword(password);
        if (!isPasswordValidate) throw new Error("Invalid Email or Password");

        if (isPasswordValidate) {
            const token = await user.getJWT();
             res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
        });
            
        }

        res.status(200).send({ message: "User Login successfully", user: user });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

authRouter.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, emailId, password } = req.body;
        validateSignup(req);

        const existingUser = await User.findOne({ emailId: emailId });
        if (existingUser) throw new Error("User Already Exist");

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const user = new User({
            firstName: firstName,
            lastName: lastName,
            emailId: emailId,
            password: hashPassword
        });

        const savedUser = await user.save();
        const token = await savedUser.getJWT();
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
        });
        res.status(200).send({ message: "User Signup successfully", user: savedUser });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

authRouter.get("/getuser", userAuth, async (req, res) => {
    try {
        const user = req.user
        res.status(200).json({ message: user });

    }
    catch (error) {
        res.status(401).json({ message: error.message });
    }
})

authRouter.post("/logout", async (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            expires: new Date(0)
        });
        res.status(200).send({ message: "User Logout successfully" });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = { authRouter };

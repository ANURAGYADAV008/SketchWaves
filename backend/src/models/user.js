const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    emailId: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email address");
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 12,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter a strong Password");
            }
        }
    },
}, { timestamps: true });

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: "7d" });
    return token;
};

userSchema.methods.getValidatePassword = async function (inputpassword) {
    const user = this;
    const isPasswordValid = await bcrypt.compare(inputpassword, user.password);
    return isPasswordValid;
};

const User = mongoose.model("User", userSchema);
module.exports = { User };
const validator = require("validator");
const validateSignup = (req) => {
    //console.log(req.body);
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName || !emailId || !password) throw new Error("All fields Are Required");
    else if (!validator.isEmail(emailId)) throw new Error("Email Is not Valid");
    else if (!validator.isStrongPassword(password)) throw new Error("Strong password Are required");
    else return true;


}

module.exports = { validateSignup }
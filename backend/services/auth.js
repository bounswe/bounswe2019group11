const User = require('../models/user');
const authHelper = require('../helpers/auth');

module.exports.signUp = async (name, surname, email, password, idNumber, iban) => {
    let role;
    if (authHelper.validateIdNumber(idNumber) && authHelper.validateIban(iban)){
        role = authHelper.ROLES.TRADER;
    } else {
        role = authHelper.ROLES.BASIC;
    }
    const user = await User.create({
        name, surname, email, password, idNumber, iban, role,
    });
    const token = user.generateJwtToken();
    delete user.password;
    return {
        user,
        token,
    }
};

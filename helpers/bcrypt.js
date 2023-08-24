const bcrypt = require("bcryptjs");

const checkPassword = (password, userPassword) => {
  return bcrypt.compareSync(password, userPassword);
};

const hashPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};
module.exports = { checkPassword, hashPassword };

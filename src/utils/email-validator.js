const validator = require('validator');

module.exports = class EmailValidator {
  isValid(email) {
    this.email = email;
    return validator.isEmail(this.email);
  }
};

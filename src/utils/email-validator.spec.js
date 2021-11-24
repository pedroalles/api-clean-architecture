const validator = require('validator');

class EmailValidator {
  isValid(email) {
    this.email = email;
    return validator.isEmail(this.email);
  }
}

describe('Email validator', () => {
  test('Should return true if validator returns true', () => {
    const sut = new EmailValidator();
    const isEmailValid = sut.isValid('valid_email@mail.com');
    expect(isEmailValid).toBeTruthy();
  });

  test('Should return false if validator returns false', () => {
    validator.isEmailValid = false;
    const sut = new EmailValidator();
    const isEmailValid = sut.isValid('invalid_email@mail.com');
    expect(isEmailValid).toBeFalsy();
  });
});

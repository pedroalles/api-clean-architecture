const validator = require('validator');

class EmailValidator {
  isValid(email) {
    this.email = email;
    return validator.isEmail(this.email);
  }
}

const makeSut = () => new EmailValidator();

describe('Email validator', () => {
  test('Should return true if validator returns true', () => {
    const sut = makeSut();
    const isEmailValid = sut.isValid('valid_email@mail.com');
    expect(isEmailValid).toBeTruthy();
  });

  test('Should return false if validator returns false', () => {
    validator.isEmailValid = false;
    const sut = makeSut();
    const isEmailValid = sut.isValid('invalid_email@mail.com');
    expect(isEmailValid).toBeFalsy();
  });
});

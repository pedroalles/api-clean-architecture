const validator = require('validator');
const EmailValidator = require('./email-validator');

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

  test('Should call validator with correct email', () => {
    const email = 'any_email@mail.com';
    const sut = makeSut();
    sut.isValid(email);
    expect(validator.email).toBe(email);
  });
});

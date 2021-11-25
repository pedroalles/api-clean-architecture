/* eslint max-classes-per-file: ["error", 4] */
const AuthUseCase = require('./auth-usecase');
const { MissingParamError, InvalidParamError } = require('../../utils/errors');

const makeSut = () => {
  class EncrypterSpy {
    async compare(password, hashedPassword) {
      this.password = password;
      this.hashedPassword = hashedPassword;
    }
  }
  class LoadUserByEmailRepositorySpy {
    async load(email) {
      this.email = email;
      return this.user;
    }
  }
  const encrypterSpy = new EncrypterSpy();
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
  loadUserByEmailRepositorySpy.user = {
    password: 'hashed_password',
  };
  const sut = new AuthUseCase(loadUserByEmailRepositorySpy, encrypterSpy);
  return {
    sut,
    loadUserByEmailRepositorySpy,
    encrypterSpy,
  };
};

describe('Auth UseCase', () => {
  test('Should throw if no email is provided', async () => {
    const { sut } = makeSut();
    const promise = sut.auth();
    await expect(promise).rejects.toThrowError(new MissingParamError('email'));
  });

  test('Should throw if no password is provided', async () => {
    const { sut } = makeSut();
    const promise = sut.auth('any_email@mail.com');
    await expect(promise).rejects.toThrowError(new MissingParamError('password'));
  });

  test('Should call LoadUserByEmailRepository with correct email', async () => {
    const email = 'any_email@mail.com';
    const { sut, loadUserByEmailRepositorySpy } = makeSut();
    await sut.auth(email, 'any_password');
    expect(loadUserByEmailRepositorySpy.email).toBe(email);
  });

  test('Should throw if no LoadUserByEmailRepository is provided', async () => {
    const sut = new AuthUseCase();
    const promise = sut.auth('any_email@mail.com', 'any_password');
    await expect(promise).rejects.toThrowError(new MissingParamError('loadUserByEmailRepository'));
  });

  test('Should throw if no LoadUserByEmailRepository has no load method', async () => {
    const sut = new AuthUseCase({});
    const promise = sut.auth('any_email@mail.com', 'any_password');
    await expect(promise).rejects.toThrowError(new InvalidParamError('loadUserByEmailRepository'));
  });

  test('Should return null if an invalid email is provided', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut();
    loadUserByEmailRepositorySpy.user = null;
    const accessToken = await sut.auth('invalid_email@mail.com', 'any_password');
    expect(accessToken).toBeNull();
  });

  test('Should return null if an invalid password is provided', async () => {
    const { sut } = makeSut();
    const accessToken = await sut.auth('valid_email@mail.com', 'invalid_password');
    expect(accessToken).toBeNull();
  });

  test('Should call Encrypter with correct values', async () => {
    const password = 'any_password';
    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut();
    await sut.auth('valid_email@mail.com', password);
    expect(encrypterSpy.password).toBe(password);
    expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password);
  });
});

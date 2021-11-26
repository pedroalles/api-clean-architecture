/* eslint max-classes-per-file: ["error", 4] */
const AuthUseCase = require('./auth-usecase');
const { MissingParamError, InvalidParamError } = require('../../utils/errors');

const makeEncrypter = () => {
  class EncrypterSpy {
    async compare(password, hashedPassword) {
      this.password = password;
      this.hashedPassword = hashedPassword;
      return this.isValid;
    }
  }
  const encrypterSpy = new EncrypterSpy();
  encrypterSpy.isValid = true;
  return encrypterSpy;
};

const makeTokenGenerator = () => {
  class TokenGeneratorSpy {
    async generate(userId) {
      this.userId = userId;
      return this.accessToken;
    }
  }
  const tokenGeneratorSpy = new TokenGeneratorSpy();
  tokenGeneratorSpy.accessToken = 'any_token';
  return tokenGeneratorSpy;
};

const makeLoadUserByEmailRepository = () => {
  class LoadUserByEmailRepositorySpy {
    async load(email) {
      this.email = email;
      return this.user;
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
  loadUserByEmailRepositorySpy.user = {
    id: 'any_id',
    password: 'hashed_password',
  };
  return loadUserByEmailRepositorySpy;
};

const makeSut = () => {
  const encrypterSpy = makeEncrypter();
  const tokenGeneratorSpy = makeTokenGenerator();
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository();

  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy,
  });

  return {
    sut,
    loadUserByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy,
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

  test('Should throw if no dependency is provided', async () => {
    const sut = new AuthUseCase();
    const promise = sut.auth('any_email@mail.com', 'any_password');
    await expect(promise).rejects.toThrowError(new MissingParamError('loadUserByEmailRepository'));
  });

  test('Should throw if no LoadUserByEmailRepository is provided', async () => {
    const sut = new AuthUseCase({});
    const promise = sut.auth('any_email@mail.com', 'any_password');
    await expect(promise).rejects.toThrowError(new MissingParamError('loadUserByEmailRepository'));
  });

  test('Should throw if no LoadUserByEmailRepository has no load method', async () => {
    const sut = new AuthUseCase({ loadUserByEmailRepository: {} });
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
    const { sut, encrypterSpy } = makeSut();
    encrypterSpy.isValid = false;
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

  test('Should call TokenGenerator with correct userID', async () => {
    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut();
    await sut.auth('valid_email@mail.com', 'valid_password');
    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id);
  });

  test('Should return an accessToken if correct credentials are provided', async () => {
    const { sut, tokenGeneratorSpy } = makeSut();
    const accessToken = await sut.auth('valid_email@mail.com', 'valid_password');
    expect(accessToken).toBeTruthy();
    expect(accessToken).toBe(tokenGeneratorSpy.accessToken);
  });
});

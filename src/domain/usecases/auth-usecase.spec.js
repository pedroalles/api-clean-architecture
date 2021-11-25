/* eslint max-classes-per-file: ["error", 4] */
const { MissingParamError } = require('../../utils/errors');

class AuthUseCase {
  constructor(loadUserByEmailRepository) {
    this.loadUserByEmailRepository = loadUserByEmailRepository;
  }

  async auth(email, password) {
    this.email = email;
    this.password = password;
    if (!this.email) {
      throw new MissingParamError('email');
    }
    if (!this.password) {
      throw new MissingParamError('password');
    }
    await this.loadUserByEmailRepository.load(this.email);
  }
}

const makeSut = () => {
  class LoadUserByEmailRepositorySpy {
    async load(email) {
      this.email = email;
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
  const sut = new AuthUseCase(loadUserByEmailRepositorySpy);
  return {
    sut,
    loadUserByEmailRepositorySpy,
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

  test('Should call LoadUserByEmail with correct email', async () => {
    const email = 'any_email@mail.com';
    const { sut, loadUserByEmailRepositorySpy } = makeSut();
    await sut.auth(email, 'any_password');
    expect(loadUserByEmailRepositorySpy.email).toBe(email);
  });
});

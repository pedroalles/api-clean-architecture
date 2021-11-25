const { MissingParamError } = require('../../utils/errors');

class AuthUseCase {
  async auth(email, password) {
    this.email = email;
    this.password = password;
    if (!this.email) {
      throw new MissingParamError('email');
    }
    if (!this.password) {
      throw new MissingParamError('password');
    }
  }
}

describe('Auth UseCase', () => {
  test('Should throw if no email is provided', async () => {
    const sut = new AuthUseCase();
    const promise = sut.auth();
    await expect(promise).rejects.toThrowError(new MissingParamError('email'));
  });

  test('Should throw if no password is provided', async () => {
    const sut = new AuthUseCase();
    const promise = sut.auth('any_email@mail.com');
    await expect(promise).rejects.toThrowError(new MissingParamError('password'));
  });
});

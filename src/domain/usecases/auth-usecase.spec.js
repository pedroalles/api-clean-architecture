const { MissingParamError } = require('../../utils/errors');

class AuthUseCase {
  async auth(email) {
    this.email = email;
    if (!this.email) {
      throw new MissingParamError('email');
    }
  }
}

describe('Auth UseCase', () => {
  test('Should throw if no email is provided', async () => {
    const sut = new AuthUseCase();
    const promise = sut.auth();
    await expect(promise).rejects.toThrowError(new MissingParamError('email'));
  });
});

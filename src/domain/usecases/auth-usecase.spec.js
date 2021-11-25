class AuthUseCase {
  async auth(email) {
    this.email = email;
    if (!this.email) {
      throw new Error();
    }
  }
}

describe('Auth UseCase', () => {
  test('Should return null if no email is provided', async () => {
    const sut = new AuthUseCase();
    const promise = sut.auth();
    await expect(promise).rejects.toThrowError();
  });
});

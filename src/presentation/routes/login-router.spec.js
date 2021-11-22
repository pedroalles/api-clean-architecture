class LoginRouter {
  route(httpRequest) {
    if (!httpRequest.body.email) {
      this.statusCode = 400;
      return {
        statusCode: this.statusCode,
      };
    }
    return false;
  }
}

describe('Login Router', () => {
  test('Should return 400 if no email is provided', () => {
    const sut = new LoginRouter();
    const httpRequest = {
      body: {
        password: 'any_password',
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
  });
});

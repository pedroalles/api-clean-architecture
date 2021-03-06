const { MissingParamError, InvalidParamError } = require('../../utils/errors');

module.exports = class AuthUseCase {
  constructor({ loadUserByEmailRepository, encrypter, tokenGenerator } = {}) {
    this.loadUserByEmailRepository = loadUserByEmailRepository;
    this.encrypter = encrypter;
    this.tokenGenerator = tokenGenerator;
  }

  async auth(email, password) {
    this.email = email;
    this.password = password;

    if (!this.email) throw new MissingParamError('email');
    if (!this.password) throw new MissingParamError('password');
    if (!this.loadUserByEmailRepository) throw new MissingParamError('loadUserByEmailRepository');
    if (!this.loadUserByEmailRepository.load) throw new InvalidParamError('loadUserByEmailRepository');

    const user = await this.loadUserByEmailRepository.load(this.email);
    if (!user) return null;
    const isValid = await this.encrypter.compare(password, user.password);
    if (!isValid) return null;

    const accessToken = await this.tokenGenerator.generate(user.id);
    return accessToken;
  }
};

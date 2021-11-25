/* eslint max-classes-per-file: ["error", 4] */
const { MissingParamError, InvalidParamError } = require('../../utils/errors');

module.exports = class AuthUseCase {
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
    if (!this.loadUserByEmailRepository) {
      throw new MissingParamError('loadUserByEmailRepository');
    }
    if (!this.loadUserByEmailRepository.load) {
      throw new InvalidParamError('loadUserByEmailRepository');
    }
    const user = await this.loadUserByEmailRepository.load(this.email);
    if (!user) return null;
    return this.accessToken;
  }
};

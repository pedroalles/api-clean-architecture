module.exports = class MissingParamError extends Error {
  constructor(paramName) {
    super(`Missing ${paramName}`);
    this.name = 'MissingParamError';
  }
};

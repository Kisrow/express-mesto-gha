const { ERROR_CODE_INCORRECT_AUTH } = require('../constants');

class IncorrectAuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'IncorrectAuthError';
    this.statusCode = ERROR_CODE_INCORRECT_AUTH;
  }
}

module.exports = {
  IncorrectAuthError,
};

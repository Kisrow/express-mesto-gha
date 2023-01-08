const { ERROR_CODE_INCORRECT_EMAIL } = require('../constants');

class IncorrectEmailError extends Error {
  constructor(message) {
    super(message);
    this.name = 'IncorrectEmailError';
    this.statusCode = ERROR_CODE_INCORRECT_EMAIL;
  }
}

module.exports = {
  IncorrectEmailError,
};

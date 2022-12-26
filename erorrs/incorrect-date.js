const { ERROR_CODE_INCORRECT_DATE } = require('../constants');

class IncorrectDateError extends Error {
  constructor(message) {
    super(message);
    this.name = 'IncorrectDateError';
    this.statusCode = ERROR_CODE_INCORRECT_DATE;
  }
}

module.exports = {
  IncorrectDateError,
};

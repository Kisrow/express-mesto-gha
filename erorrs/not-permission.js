const { ERROR_CODE_NOT_PERMISSION } = require('../constants');

class NotPermissionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotPermissionError';
    this.statusCode = ERROR_CODE_NOT_PERMISSION;
  }
}

module.exports = {
  NotPermissionError,
};

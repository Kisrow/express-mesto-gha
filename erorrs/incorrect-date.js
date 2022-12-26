class IncorrectDateError extends Error {
  constructor(message) {
    super(message);
    // this.name = 'ValidationError';
    this.name = 'IncorrectDateError';
    this.statusCode = 400;
  }
}

module.exports = {
  IncorrectDateError,
};

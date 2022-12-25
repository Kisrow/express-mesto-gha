class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CastError';
    this.statusCode = 404;
  }
}

module.exports = {
  NotFoundError,
};

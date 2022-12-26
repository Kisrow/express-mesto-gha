const { NotFoundError } = require('../erorrs/not-found');

module.exports.notFoundRequest = (req, res) => {
  const NotFound = new NotFoundError('не существует');
  res.status(NotFound.statusCode).send({ message: NotFound.message });
};

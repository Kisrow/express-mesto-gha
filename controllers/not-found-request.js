const { NotFoundError } = require('../erorrs/not-found');

const NotFound = new NotFoundError('не существует');

module.exports.notFoundRequest = (req, res) => {
  res.status(NotFound.statusCode).send({ message: NotFound.message });
};

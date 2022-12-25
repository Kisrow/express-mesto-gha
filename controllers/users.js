const User = require('../models/user');
const { IncorrectDateError } = require('../erorrs/incorrect-date');
const { NotFoundError } = require('../erorrs/not-found');

const IncorrectDate = new IncorrectDateError('Некорректные данные');
const NotFound = new NotFoundError('отсутствует');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

module.exports.getUserById = (req, res) => {
  const id = req.params.userId;
  User.findById(id)
    .orFail(() => IncorrectDate)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(NotFound.statusCode).send({ message: `Пользователь ${id} ${NotFound.message}` });
      }
      if (err.name === 'CastError') {
        return res.status(IncorrectDate.statusCode).send({ message: `${IncorrectDate.message} пользователя` });
      }
      res.status(500).send({ message: `Произошла ошибка ${err}` });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(IncorrectDate.statusCode).send({ message: `${IncorrectDate.message} пользователя` });
      }
      return res.status(500).send({ message: `Произошла ошибка ${err}` });
    });
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(NotFound.statusCode).send({ message: `Пользователь ${NotFound.message}` });
      }
      if (err.name === 'ValidationError') {
        return res.status(IncorrectDate.statusCode).send({ message: `${IncorrectDate.message} пользователя` });
      }
      res.status(500).send({ message: `Произошла ошибка ${err}` });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(
    id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(NotFound.statusCode).send({ message: `Пользователь ${NotFound.message}` });
      }
      if (err.name === 'ValidationError') {
        return res.status(IncorrectDate.statusCode).send({ message: `${IncorrectDate.message} пользователя` });
      }
      res.status(500).send({ message: `Произошла ошибка ${err}` });
    });
};

const User = require('../models/user');
const { IncorrectDateError } = require('../erorrs/incorrect-date');
const { NotFoundError } = require('../erorrs/not-found');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err.name} c текстом ${err.message}` }));
};

module.exports.getUserById = (req, res) => {
  const id = req.params.userId;
  User.findById(id)
    .orFail(() => new NotFoundError())
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        const NotFound = new NotFoundError(`Пользователь по id ${id} не найден`);
        return res.status(NotFound.statusCode).send({ message: NotFound.message });
      }
      if (err.name === 'CastError') {
        const IncorrectDate = new IncorrectDateError('Некорректные данные');
        return res.status(IncorrectDate.statusCode).send({ message: `${IncorrectDate.message} пользователя` });
      }
      return res.status(500).send({ message: `Произошла ошибка ${err.name} c текстом ${err.message}` });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const IncorrectDate = new IncorrectDateError('Переданы некорректные данные при создании пользователя');
        return res.status(IncorrectDate.statusCode).send({ message: IncorrectDate.message });
      }
      return res.status(500).send({ message: `Произошла ошибка ${err.name} c текстом ${err.message}` });
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
      if (err.name === 'ValidationError') {
        const IncorrectDate = new IncorrectDateError('Переданы некорректные данные при обновлении профиля');
        return res.status(IncorrectDate.statusCode).send({ message: IncorrectDate.message });
      }
      return res.status(500).send({ message: `Произошла ошибка ${err.name} c текстом ${err.message}` });
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
      if (err.name === 'ValidationError') {
        const IncorrectDate = new IncorrectDateError('Переданы некорректные данные при обновлении аватара');
        return res.status(IncorrectDate.statusCode).send({ message: IncorrectDate.message });
      }
      return res.status(500).send({ message: `Произошла ошибка ${err.name} c текстом ${err.message}` });
    });
};

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { IncorrectDateError } = require('../erorrs/incorrect-date');
const { NotFoundError } = require('../erorrs/not-found');
const { IncorrectEmailError } = require('../erorrs/incorret-email');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .orFail(() => next(new NotFoundError(`Пользователь по id ${id} не найден`)))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectDateError('Некорректные данные пользователя'));
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  // Проверка на актуальность, findOne возвр значение или undefined
  User.findOne({ email })
    .then((matched) => {
      if (matched) {
        next(new IncorrectEmailError('Пользователь уже зарегистрирован'));
      }
      bcrypt.hash(password, 10)
        .then((hash) => {
          User.create({
            name,
            about,
            avatar,
            email,
            password: hash,
          })
            .then((user) => res.send({
              name,
              about,
              avatar,
              email,
              _id: user._id,
            }))
            .catch((err) => {
              if (err.name === 'ValidationError') {
                next(new IncorrectDateError('Переданы некорректные данные при создании пользователя'));
              }
              next(err);
            });
        });
    })
    .catch(next);
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => next(new NotFoundError(`Пользователь ${id} не найден`)))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDateError('Переданы некорректные данные при обновлении профиля'));
      }
      next(err);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(
    id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => next(new NotFoundError(`Пользователь ${id} не найден`)))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDateError('Переданы некорректные данные при обновлении аватара'));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ email });
    })
    .catch(next);
};

module.exports.getAuthorizedUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => next(new NotFoundError('Пользователь не найден')))
    .then((user) => res.send(user))
    .catch(next);
};

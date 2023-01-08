const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { IncorrectAuthError } = require('../erorrs/incorrect-auth');
const { regExpUrl } = require('../middlewares/validate');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(url) {
        return regExpUrl.test(url);
      },
      message: 'Ссылка на аватар невалидна',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: 'Некорректный email',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    select: false,
  },
});

// не стрелочная, стрелочные запоминают this
userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new IncorrectAuthError('Неправильный логин или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new IncorrectAuthError('Неправильный логин или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);

const { celebrate, Joi } = require('celebrate');

const regExpUrl = /^(http)s?:\/\/(www\.)?[a-zA-Z0-9-]+\.([\w\-.~:/?#[\]@!$&'()*+,;=]+)/;

const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().regex(RegExp(regExpUrl)),
  }),
});

const defineCardIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).required()
      .hex(),
  }),
});

const defineUserIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24).required()
      .hex(),
  }),
});

const updateUserInfoValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const updateUserAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(RegExp(regExpUrl)),
  }),
});

const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
    avatar: Joi.string().default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png').regex(RegExp(regExpUrl)),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports = {
  createCardValidation,
  defineCardIdValidation,
  defineUserIdValidation,
  updateUserInfoValidation,
  updateUserAvatarValidation,
  createUserValidation,
  loginValidation,
  regExpUrl,
};

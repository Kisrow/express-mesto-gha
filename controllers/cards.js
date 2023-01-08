const Card = require('../models/card');
const { IncorrectDateError } = require('../erorrs/incorrect-date');
const { NotFoundError } = require('../erorrs/not-found');
const { NotPermissionError } = require('../erorrs/not-permission');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDateError('Переданы некорректные данные при создании карточки'));
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const id = req.params.cardId;
  Card.findByIdAndRemove(id)
    .orFail(() => next(new NotFoundError(`Карточка ${id} не найдена`)))
    .then((card) => {
      if ((JSON.stringify(card.owner) === JSON.stringify(req.user._id))) {
        res.send({ message: 'карточка успешно удалена' });
      }
      next(new NotPermissionError('Карточка не ваша'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectDateError(`id ${req.params.cardId} указан некорректно`));
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => next(new NotFoundError(`карточки с id ${req.params.cardId} не существует`)))
    .then(() => res.send({ message: 'лайк успешно поставлен' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectDateError('Переданы некорректные данные при постановки лайка'));
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => next(new NotFoundError(`карточки с id ${req.params.cardId} не существует`)))
    .then(() => res.send({ message: 'лайк успешно удален' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectDateError('Переданы некорректные данные при снятии лайка'));
      }
      next(err);
    });
};

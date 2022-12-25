const Card = require('../models/card');
const { IncorrectDateError } = require('../erorrs/incorrect-date');
const { NotFoundError } = require('../erorrs/not-found');

const IncorrectDate = new IncorrectDateError('некорректные данные');
const NotFound = new NotFoundError('не существует');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id; // временное решение
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(IncorrectDate.statusCode).send({ message: `Ошибка: ${IncorrectDate.message}` });
      }
      res.status(500).send({ message: `Произошла ошибка ${err}` });
    });
};

module.exports.deleteCard = (req, res) => {
  const id = req.params.cardId;
  Card.findByIdAndRemove(id)
    .then((card) => res.send({ message: `${card} - успешно удалена` }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(NotFound.statusCode).send({ message: `Ошибка: ${NotFound.message}` });
      }
      res.status(500).send({ message: `Произошла ошибка ${err}` });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => IncorrectDate)
    .then((card) => res.send({ message: `лайк успешно поставлен ${card.name}` }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(NotFound.statusCode).send({ message: `Ошибка: ${NotFound.message}` });
      }
      if (err.name === 'CastError') {
        return res.status(IncorrectDate.statusCode).send({ message: `Ошибка: ${IncorrectDate.message}` });
      }
      res.status(500).send({ message: `Произошла ошибка ${err}` });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => IncorrectDate)
    .then((card) => res.send({ message: `лайк успешно удален карточке ${card.name}` }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(NotFound.statusCode).send({ message: `Ошибка: ${NotFound.message}` });
      }
      if (err.name === 'CastError') {
        return res.status(IncorrectDate.statusCode).send({ message: `Ошибка: ${IncorrectDate.message}` });
      }
      res.status(500).send({ message: `Произошла ошибка ${err}` });
    });
};

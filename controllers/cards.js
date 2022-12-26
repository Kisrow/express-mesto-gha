const Card = require('../models/card');
const { IncorrectDateError } = require('../erorrs/incorrect-date');
const { NotFoundError } = require('../erorrs/not-found');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err.name} c текстом ${err.message}` }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id; // временное решение
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const IncorrectDate = new IncorrectDateError('Переданы некорректные данные при создании карточки');
        return res.status(IncorrectDate.statusCode).send({ message: `${IncorrectDate.message}` });
      }
      res.status(500).send({ message: `Произошла ошибка ${err.name} c текстом ${err.message}` });
    });
};

module.exports.deleteCard = (req, res) => {
  const id = req.params.cardId;
  Card.findByIdAndRemove(id)
    .orFail(() => new NotFoundError())
    .then(() => res.send({ message: 'карточка успешно удалена' }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        const NotFound = new NotFoundError(`Карточка ${id} не найдена`);
        return res.status(NotFound.statusCode).send({ message: NotFound.message });
      }
      if (err.name === 'CastError') {
        const IncorrectDate = new IncorrectDateError(`id ${req.params.cardId} указан некорректно`);
        return res.status(IncorrectDate.statusCode).send({ message: IncorrectDate.message });
      }
      res.status(500).send({ message: `Произошла ошибка ${err.name} c текстом ${err.message}` });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => new NotFoundError())
    .then(() => res.send({ message: 'лайк успешно поставлен' }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        const NotFound = new NotFoundError(`карточки с id ${req.params.cardId} не существует`);
        return res.status(NotFound.statusCode).send({ message: NotFound.message });
      }
      if (err.name === 'CastError') {
        const IncorrectDate = new IncorrectDateError('Переданы некорректные данные при постановки лайка');
        return res.status(IncorrectDate.statusCode).send({ message: IncorrectDate.message });
      }
      res.status(500).send({ message: `Произошла ошибка ${err.name} c текстом ${err.message}` });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => new NotFoundError())
    .then(() => res.send({ message: 'лайк успешно удален' }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        const NotFound = new NotFoundError(`карточки с id ${req.params.cardId} не существует`);
        return res.status(NotFound.statusCode).send({ message: NotFound.message });
      }
      if (err.name === 'CastError') {
        const IncorrectDate = new IncorrectDateError('Переданы некорректные данные при снятии лайка');
        return res.status(IncorrectDate.statusCode).send({ message: IncorrectDate.message });
      }
      res.status(500).send({ message: `Произошла ошибка ${err.name} c текстом ${err.message}` });
    });
};

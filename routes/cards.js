const router = require('express').Router();
const {
  createCardValidation,
  defineCardIdValidation,
} = require('../middlewares/validate');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.delete('/:cardId', defineCardIdValidation, deleteCard);
router.post('/', createCardValidation, createCard);
router.put('/:cardId/likes', defineCardIdValidation, likeCard);
router.delete('/:cardId/likes', defineCardIdValidation, dislikeCard);

module.exports = router;

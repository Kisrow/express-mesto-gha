const router = require('express').Router();
const {
  notFoundRequest,
} = require('../controllers/not-found-request');

router.all('/', notFoundRequest);

module.exports = router;

const express = require('express');

const FortuneWheel = require('../controllers/fortuneWheel');
// const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

//INDEX
router.get('/', FortuneWheel.index);

//SAVE
router.post('/', FortuneWheel.store);

//SHOW
router.get('/:id', FortuneWheel.show);

//UPDATE
router.put('/:id', FortuneWheel.update);

//DELETE
router.delete('/:id', authenticate, FortuneWheel.destroy);

module.exports = router;



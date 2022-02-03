const express = require('express');

const LevelBonus = require('../controllers/levelBonus');
// const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

//INDEX
router.get('/', LevelBonus.index);

//SAVE
router.post('/', authenticate, LevelBonus.store);

//SHOW
router.get('/:id', LevelBonus.show);

//UPDATE
router.put('/:id', authenticate, LevelBonus.update);

//DELETE
router.delete('/:id', authenticate, LevelBonus.destroy);

module.exports = router;



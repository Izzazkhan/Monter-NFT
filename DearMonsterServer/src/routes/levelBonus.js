const express = require('express');

const LevelBonus = require('../controllers/levelBonus');
// const validate = require('../middlewares/validate');

const router = express.Router();

//INDEX
router.get('/', LevelBonus.index);

//SAVE
router.post('/', LevelBonus.store);

//SHOW
router.get('/:id',  LevelBonus.show);

//UPDATE
router.put('/:id', LevelBonus.update);

//DELETE
router.delete('/:id', LevelBonus.destroy);

module.exports = router;



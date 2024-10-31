const express = require('express');

const FightHistory = require('../controllers/fightHistory');
// const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

//INDEX
router.get('/', FightHistory.index);

//FIGHT BY TYPE
router.get('/:type', FightHistory.fightHistoryBySearch);

//SAVE
router.post('/', FightHistory.store);

//SHOW
// router.get('/:id', FightHistory.show);

// //UPDATE
// router.put('/:id', authenticate, FightHistory.update);

// //DELETE
// router.delete('/:id', authenticate, FightHistory.destroy);

module.exports = router;



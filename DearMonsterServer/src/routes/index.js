const express = require('express')
const router = express.Router()


const auth = require('./auth');
const user = require('./user');
const monster = require('./monster');
const minion = require('./minion');
const mintedMonster = require('./mintedMonster');
const tradeItem = require('./tradeItem');
const levelBonus = require('./levelBonus');
const probabiltyList = require('./probabiltyList');
const fightHistory = require('./fightHistory');
const userEarning = require('./userEarning');
const withdrawRequest = require('./withdrawRequest');
const scholarship = require('./scholarship');


const authenticate = require('../middlewares/authenticate');

router.get('/', (req, res) => {
    res.status(200).send({ message: "Welcome to the SERVER APIs" });
});
router.use('/auth', auth);


router.use('/userA', authenticate, user);
router.use('/minionA', authenticate, minion);
router.use('/monsterA', authenticate, monster);
router.use('/mintedMonsterA', authenticate, mintedMonster);
router.use('/tradeItemA', authenticate, tradeItem);


router.use('/user', user);
router.use('/minion', minion);
router.use('/monster', monster);
router.use('/mintedMonster', mintedMonster);
router.use('/tradeItem', tradeItem);
router.use('/userEarning', userEarning);
router.use('/withdrawRequest', withdrawRequest);
router.use('/levelBonus', levelBonus);
router.use('/probabiltyList', probabiltyList);
router.use('/fightHistory', fightHistory);
router.use('/scholarship', scholarship);

module.exports = router
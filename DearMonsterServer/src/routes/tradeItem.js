const express = require('express');
// const {check} = require('express-validator');
// const multer = require('multer');

const TradeItem = require('../controllers/tradeItem');
// const validate = require('../middlewares/validate');

const router = express.Router();

// const upload = multer().single('profileImage');

router.get('/allInTrade', TradeItem.allInTrade);

router.get('/inTradeItems/:owner', TradeItem.inTradeItems);

router.post('/buyFromAllTradeItems', TradeItem.buyFromAllTradeItems);

//INDEX
router.get('/', TradeItem.index);

//STORE
router.post('/', TradeItem.store);

//SHOW
router.get('/:id',  TradeItem.show);

//UPDATE
router.put('/:id', TradeItem.update);

//DELETE
router.delete('/:id', TradeItem.destroy);

module.exports = router;
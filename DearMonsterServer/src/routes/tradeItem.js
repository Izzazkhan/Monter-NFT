const express = require('express');
// const {check} = require('express-validator');
// const multer = require('multer');

const TradeItem = require('../controllers/tradeItems');
// const validate = require('../middlewares/validate');

const router = express.Router();

// const upload = multer().single('profileImage');

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
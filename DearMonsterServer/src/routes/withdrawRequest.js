const express = require('express');

const WithdrawRequest = require('../controllers/withdrawRequest');

const router = express.Router();

//INDEX
router.get('/', WithdrawRequest.index);

//PENDING
router.get('/pending', WithdrawRequest.pending);

//STORE
router.post('/', WithdrawRequest.store);

//UPDATE
router.put('/:id', WithdrawRequest.update);

//DELETE
router.delete('/:id', WithdrawRequest.destroy);

module.exports = router;



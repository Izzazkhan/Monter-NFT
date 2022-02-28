const express = require('express');

const WithdrawRequest = require('../controllers/withdrawRequest');

const router = express.Router();

//INDEX
router.get('/userWithdrawRequest/:wallet/:type', WithdrawRequest.userWithdrawRequest);

router.get('/claimHistory/:wallet/:type', WithdrawRequest.claimHistory);

//INDEX
router.get('/userResolvedWithdrawRequest/:wallet/:type', WithdrawRequest.userResolvedWithdrawRequest);
//INDEX
router.get('/', WithdrawRequest.index);

//PENDING
router.get('/pending/:wallet/:type', WithdrawRequest.pending);

//STORE
router.post('/:type', WithdrawRequest.store);

//UPDATE
router.put('/:id/:type', WithdrawRequest.update);

//DELETE
router.delete('/:id', WithdrawRequest.destroy);

module.exports = router;



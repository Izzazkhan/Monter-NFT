const express = require('express');

const BUSDRequest = require('../controllers/BUSDRequest');

const router = express.Router();

// REQUEST BY WALLET
router.get('/busdRequestByWallet/:wallet', BUSDRequest.requestByWallet);

//INDEX
router.get('/:wallet/:type', BUSDRequest.userWithdrawRequest);

router.get('/claimHistory/:wallet/:type', BUSDRequest.claimHistory);

//INDEX
router.get('/userResolvedWithdrawRequest/:wallet/:type', BUSDRequest.userResolvedWithdrawRequest);
//INDEX
router.get('/', BUSDRequest.index);

//PENDING
router.get('/pending/:wallet/:type', BUSDRequest.pending);



//STORE
router.post('/:type', BUSDRequest.store);

//UPDATE
router.put('/:wallet/:type/:id', BUSDRequest.update);

//STATUS UPDATE
router.put('/:id', BUSDRequest.statusUpdate);

//DELETE
router.delete('/:id', BUSDRequest.destroy);

module.exports = router;



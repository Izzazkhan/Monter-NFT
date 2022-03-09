const express = require('express');

const UserEarning = require('../controllers/userEarning');

const router = express.Router();

//REWARD BY WALLET
router.get('/rewardByWallet/:earnerAddress', UserEarning.rewardByWallet);

//INDEX
router.get('/:earnerAddress/:type', UserEarning.show);

//STORE
router.post('/', UserEarning.store);

//UPDATE
router.put('/:earnerAddress/:type', UserEarning.update);

//DELETE
router.delete('/:id', UserEarning.destroy);

module.exports = router;



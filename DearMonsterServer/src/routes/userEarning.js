const express = require('express');

const UserEarning = require('../controllers/userEarning');

const router = express.Router();

//INDEX
router.get('/:earnerAddress', UserEarning.show);

//STORE
router.post('/', UserEarning.store);

//UPDATE
router.put('/:id', UserEarning.update);

//DELETE
router.delete('/:id', UserEarning.destroy);

module.exports = router;



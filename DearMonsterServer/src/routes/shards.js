const express = require('express');

const Shards = require('../controllers/shards');
// const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

//INDEX
router.get('/', Shards.index);

//SAVE
router.post('/', Shards.store);

//SHOW
router.get('/:id', Shards.show);

//UPDATE
router.put('/:id', authenticate, Shards.update);

//DELETE
router.delete('/:id', authenticate, Shards.destroy);

module.exports = router;



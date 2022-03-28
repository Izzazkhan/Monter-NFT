const express = require('express');

const SpinRecord = require('../controllers/spinRecord');
// const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

//INDEX
router.get('/', SpinRecord.index);

//SAVE
router.post('/', SpinRecord.store);

//SHOW
router.get('/:id', SpinRecord.show);

//UPDATE
router.put('/:userId/:type', SpinRecord.update);

//DELETE
router.delete('/:id', authenticate, SpinRecord.destroy);

module.exports = router;



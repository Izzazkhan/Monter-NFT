const express = require('express');

const SpinCost = require('../controllers/spinCost');
// const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

//INDEX
router.get('/', SpinCost.index);

//SAVE
router.post('/', SpinCost.store);

//SHOW
router.get('/:id', SpinCost.show);

//UPDATE
router.put('/:id', SpinCost.update);

//DELETE
router.delete('/:id', authenticate, SpinCost.destroy);

module.exports = router;



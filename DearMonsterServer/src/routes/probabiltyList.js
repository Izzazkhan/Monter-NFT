const express = require('express');

const ProbabilityList = require('../controllers/probabiltyList');
// const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

//INDEX
router.get('/', ProbabilityList.index);

//SAVE
router.post('/', authenticate, ProbabilityList.store);

//SHOW
// router.get('/:id', ProbabilityList.show);

//UPDATE
router.put('/:id', authenticate, ProbabilityList.update);

//DELETE
router.delete('/:id', authenticate, ProbabilityList.destroy);

module.exports = router;



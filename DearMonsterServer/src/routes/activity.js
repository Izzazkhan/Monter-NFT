const express = require('express');

const Activity = require('../controllers/activity');

const authenticate = require('../middlewares/authenticate');

const router = express.Router();

//INDEX
router.get('/', Activity.index);

//SAVE
router.post('/', Activity.store);


module.exports = router;



const express = require('express');

const WheelHistory = require('../controllers/wheelHistory');
// const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

//INDEX
router.get('/', WheelHistory.index);

//SAVE
router.post('/', WheelHistory.store);

//GET ALL CATEGORIES
router.get('/getAllCategories', WheelHistory.getAllCategories);

//CATEGORY
router.get('/:name', WheelHistory.historyByCategory);

// //UPDATE
// router.put('/:id', authenticate, WheelHistory.update);

// //DELETE
// router.delete('/:id', authenticate, WheelHistory.destroy);

module.exports = router;



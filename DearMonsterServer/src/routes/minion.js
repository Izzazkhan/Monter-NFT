const express = require('express');
// const {check} = require('express-validator');
// const multer = require('multer');

const Minion = require('../controllers/minion');
// const validate = require('../middlewares/validate');

const router = express.Router();

// const upload = multer().single('profileImage');

//INDEX
router.get('/', Minion.index);

//STORE
// router.post('/', [
//     check('email').isEmail().withMessage('Enter a valid email address'),
//     check('Minionname').not().isEmpty().withMessage('You Minionname is required'),
//     check('firstName').not().isEmpty().withMessage('You first name is required'),
//     check('lastName').not().isEmpty().withMessage('You last name is required')
// ], validate, Minion.store);

router.post('/', Minion.store);

//SHOW
router.get('/:id',  Minion.show);

//UPDATE
router.put('/:id', Minion.update);

//DELETE
router.delete('/:id', Minion.destroy);

module.exports = router;



const express = require('express');
// const {check} = require('express-validator');
// const multer = require('multer');
const authenticate = require('../middlewares/authenticate');

const Monster = require('../controllers/monster');
// const validate = require('../middlewares/validate');

const router = express.Router();

// const upload = multer().single('profileImage');


//MONSTER LIST
router.get('/monsterList', Monster.monsterList);

//INDEX
router.get('/', Monster.index);

//STORE WITH VALIDATION
// router.post('/', [
//     check('email').isEmail().withMessage('Enter a valid email address'),
//     check('Monstername').not().isEmpty().withMessage('You Monstername is required'),
//     check('firstName').not().isEmpty().withMessage('You first name is required'),
//     check('lastName').not().isEmpty().withMessage('You last name is required')
// ], validate, Monster.store);

//STORE
router.post('/', authenticate, Monster.store);

//SHOW
router.get('/:id', Monster.show);

//UPDATE
router.put('/:id', authenticate, Monster.update);

//DELETE
router.delete('/:id', authenticate, Monster.destroy);

module.exports = router;



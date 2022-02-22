const express = require('express');
// const {check} = require('express-validator');
// const multer = require('multer');

const MintedMonster = require('../controllers/mintedMonster');
// const validate = require('../middlewares/validate');

const router = express.Router();

// const upload = multer().single('profileImage');

router.post('/setEnergyTime/:id', MintedMonster.setEnergyTime);

//INDEX
router.get('/ownerItems/:owner', MintedMonster.index);

//STORE
router.post('/', MintedMonster.store);

//SHOW
router.get('/:id',  MintedMonster.show);

//UPDATE
router.put('/:id', MintedMonster.update);

//DELETE
router.delete('/:id', MintedMonster.destroy);

module.exports = router;
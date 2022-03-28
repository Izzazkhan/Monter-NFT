const express = require('express');
const authenticate = require('../middlewares/authenticate');

const UserShard = require('../controllers/userShard');
// const validate = require('../middlewares/validate');

const router = express.Router();

// const upload = multer().single('profileImage');

//INDEX
router.get('/', UserShard.index);


router.post('/', UserShard.store);

//SHOW
router.get('/:userId/:type', UserShard.show);

//UPDATE
router.put('/:userId/:type/:id', UserShard.update);

// //DELETE
// router.delete('/:id', authenticate, UserShard.destroy);

module.exports = router;



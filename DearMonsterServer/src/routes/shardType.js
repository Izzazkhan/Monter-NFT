const express = require('express');
const multer = require('multer');
const authenticate = require('../middlewares/authenticate');

const PATH = './uploads';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, PATH);
    },
    filename: (req, file, cb) => {
      cb(
        null,
        new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname
      );
    },
});

const upload = multer({ storage: storage });

const ShardType = require('../controllers/shardType');
// const validate = require('../middlewares/validate');

const router = express.Router();

// const upload = multer().single('profileImage');

//INDEX
router.get('/', ShardType.index);


router.post('/', upload.single('image'), ShardType.store);

// //SHOW
// router.get('/:id', ShardType.show);

//UPDATE
router.put('/:id', upload.single('image'), ShardType.update);

//DELETE
router.delete('/:id', authenticate, ShardType.destroy);

module.exports = router;



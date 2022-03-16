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

const CrystalShard = require('../controllers/crystalShard');
// const validate = require('../middlewares/validate');

const router = express.Router();

// const upload = multer().single('profileImage');

//INDEX
router.get('/', CrystalShard.index);


router.post('/', upload.single('crystalImage'), CrystalShard.store);

// //SHOW
// router.get('/:id', CrystalShard.show);

//UPDATE
router.put('/:id', upload.single('crystalImage'), CrystalShard.update);

//DELETE
router.delete('/:id', authenticate, CrystalShard.destroy);

module.exports = router;



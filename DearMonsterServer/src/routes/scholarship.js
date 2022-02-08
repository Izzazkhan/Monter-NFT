const express = require('express');
const authenticate = require('../middlewares/authenticate')
const Scholarship = require('../controllers/scholarship')
const router = express.Router();
//INDEX

router.post('/:id', authenticate, Scholarship.store)
router.get('/:id', authenticate, Scholarship.show);
router.delete('/:id', authenticate, Scholarship.destroy);

module.exports = router;



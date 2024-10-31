const express = require('express');
const authenticate = require('../middlewares/authenticate')
const Scholarship = require('../controllers/scholarship')
const router = express.Router();
//INDEX

router.post('/:id', Scholarship.store)
router.get('/:owner', Scholarship.index);
router.get('/onScholar/:owner', Scholarship.onScholar);

router.get('/scholarItems/:scholar', Scholarship.scholarItems);
// router.delete('/:id', authenticate, Scholarship.destroy);
router.delete('/:id', Scholarship.destroy)
router.put('/:id', Scholarship.update)


module.exports = router;



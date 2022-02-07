const authenticate = require('../middlewares/authenticate')
const Scholarship = require('../controllers/scholarship')

//INDEX

router.post('/:id', authenticate, Scholarship.store)
router.get('/:id', authenticate, Scholarship.show);
router.delete('/:id', authenticate, Scholarship.destroy);

module.exports = router;



const router = require('express').Router();
const userController = require('../controllers/User');

router.get('/', userController.getPackages);
router.post('/', userController.postPackage);
router.delete('/:packageId', userController.deletePackage);

module.exports = router;
const router = require('express').Router();
const creditPackageController = require('../controllers/creditPackage');

router.get('/', creditPackageController.getPackages);
router.post('/', creditPackageController.postPackage);
router.delete('/:packageId', creditPackageController.deletePackage);

module.exports = router;
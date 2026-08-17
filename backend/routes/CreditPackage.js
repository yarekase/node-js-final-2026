const router = require('express').Router();
const CreditPackageController = require('../controllers/CreditPackage');

router.get('/', CreditPackageController.getPackages);
router.post('/', CreditPackageController.postPackage);
router.delete('/:packageId', CreditPackageController.deletePackage);

module.exports = router;
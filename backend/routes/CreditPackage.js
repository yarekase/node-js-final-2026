const router = require('express').Router();
const creditPackageController = require('../controllers/creditPackage');
const isAuth = require('../middlewares/isAuth');

router.get('/', creditPackageController.getPackages);
router.post('/', creditPackageController.postPackage);
router.post('/:creditPackageId', isAuth, creditPackageController.buyPackage);
router.delete('/:packageId', creditPackageController.deletePackage);

module.exports = router;
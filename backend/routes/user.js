const router = require('express').Router();
const userController = require('../controllers/user');
const isAuth = require('../middlewares/isAuth');


router.post('/signup', userController.signup);
router.post('/login', userController.login);

router.get('/profile', isAuth, userController.getUserProfile);
router.put('/profile', isAuth, userController.changeName);
router.put('/password', isAuth, userController.changePassword);

router.get('/credit-package', isAuth, userController.getPurchaseRecords);
// 查看自己購買的方案紀錄
router.get('/courses', isAuth, userController.getUserCourseCredits);

module.exports = router;
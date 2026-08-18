const router = require('express').Router();
const userController = require('../controllers/User');
const isAuth = require('../middlewares/isAuth');


router.post('/signup', userController.signup);
router.post('/login', userController.login);

router.get('/profile', isAuth, userController.getUserProfile);
router.put('/profile', isAuth, userController.changeName);

module.exports = router;
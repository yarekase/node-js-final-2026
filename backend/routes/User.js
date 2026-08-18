const router = require('express').Router();
const userController = require('../controllers/User');


router.get('/profile', userController.getUserProfile);
router.post('/signup', userController.signup);
router.post('/login', userController.login);

module.exports = router;
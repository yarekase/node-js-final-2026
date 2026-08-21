const router = require('express').Router();
const coachController = require('../controllers/coach');
const isAuth = require('../middlewares/isAuth');
const isCoach = require('../middlewares/isCoach');

router.get('/', coachController.getAllCoaches);





module.exports = router;
const router = require('express').Router();
const pobController = require('../controllers/pob');
const isAuth = require('../middlewares/isAuth');
const isCoach = require('../middlewares/isCoach');

router.get('/coaches', pobController.getAllCoaches);
router.get('/courses', pobController.getLivingCourses);
router.get('/coaches/:coachId', pobController.getOneCoach);
router.get('/coaches/:coachId/courses', pobController.getCoachCourses);



module.exports = router;
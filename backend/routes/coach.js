const router = require('express').Router();
const coachController = require('../controllers/coach');
const isAuth = require('../middlewares/isAuth');
const isCoach = require('../middlewares/isCoach');



router.get('/', isAuth, isCoach, coachController.getCoachProfile);
router.put('/', isAuth, isCoach, coachController.updateCoachProfile);
router.get('/courses', isAuth, isCoach, coachController.getCoachCourses);
router.post('/courses', isAuth, isCoach, coachController.addCourse);

router.post('/:userId', coachController.roleConvert);

module.exports = router;
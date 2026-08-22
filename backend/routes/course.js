const router = require('express').Router();
const courseController = require('../controllers/course');
const isAuth = require('../middlewares/isAuth');

router.post('/:courseId', isAuth, courseController.bookCourse);

module.exports = router;
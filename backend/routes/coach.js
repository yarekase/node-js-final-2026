const router = require('express').Router();
const coachController = require('../controllers/coach');

router.post('/', coachController.roleConvert);

module.exports = router;
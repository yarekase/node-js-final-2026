const router = require('express').Router();
const uploadController = require('../controllers/upload');
const isAuth = require('../middlewares/isAuth');
const upload = require('../middlewares/upload');

router.post('/', isAuth, upload.single('file'), uploadController.uploadImage);

module.exports = router;
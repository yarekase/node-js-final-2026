const multer = require('multer');
const appError = require('../utils/appError');

const upload = multer({
    limits: {
        fileSize: 2 * 1024 * 1024, // 限制 2MB 以內
    },
    fileFilter(req, file, cb) {
        // 只允許 jpg, png 格式
        if (!file.mimetype.match(/^image\/(jpeg|jpg|png)$/)) {
            return cb(appError(400, '檔案格式不符，僅支援 jpg、png'));
        }
        cb(null, true);
    },
    storage: multer.memoryStorage(), // 暫存於記憶體
});

module.exports = upload;

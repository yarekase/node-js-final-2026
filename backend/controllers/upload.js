const path = require('path');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const r2Client = require('../config/r2');
const appError = require('../utils/appError');

const uploadController = {
    async uploadImage(req, res, next) {


        if (!req.file) {
            return next(appError(400, '請選擇要上傳的圖片'));
        }

        const ext = path.extname(req.file.originalname);
        const fileName = `nodejs/avatars/${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

        const uploadParams = {
            Bucket: process.env.R2_BUCKET_NAME,
            Key: fileName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        };

        // 發送指令上傳至 R2
        await r2Client.send(new PutObjectCommand(uploadParams));

        const imageUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;

        res.status(200).json({
            status: 'success',
            data: {
                image_url: imageUrl,
            },
        });

    },
};

module.exports = uploadController;
const { dataSource } = require("../db/data-source");
const appError = require("../utils/appError");
const { isValidString, isValidPassword, isInteger } = require("../utils/validUtils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { get } = require('../config/index')

const pw_err = '密碼不符合規則，需包含英文大小寫及數字，字數在8~16字之間'

const userController = {
    // 取得登入會員資訊`
    async getUserProfile(req, res, next) {
        // 檢查是否有標頭以及格式是否正確
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            next(appError(401, '請先登入'));
            return;
        }
        const token = req.headers.authorization.split(' ')[1];

        try {
            const decoded = jwt.verify(token, get('secret.jwtSecret'));
            const userRepo = dataSource.getRepository("User");
            const user = await userRepo.findOneBy({ id: decoded.id });

            if (!user) {
                next(appError(401, '無效的 token'));
                return;
            }

            res.status(200).json({
                status: 'success',
                data: {
                    user: {
                        name: user.name,
                        email: user.email
                    }
                }
            });

        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                next(appError(401, 'Token 已過期'))
                return;
            }
            next(appError(401, '無效的 token'))
            return;
        }

    },

    // 註冊新會員
    async signup(req, res, next) {
        const { name, email, password } = req.body;
        // 檢查姓名、Email和密碼格式
        if (!isValidString(name) || !isValidString(email) || !isValidString(password)) {
            next(appError(400, '欄位未正確填寫'));
            return;
        }
        // 檢查密碼是否符合規則
        if (!isValidPassword(password)) {
            next(appError(400, pw_err));
            return;
        }
        // 讀取資料庫
        const userRepo = dataSource.getRepository("User");
        //檢查email有無重複
        const existingUser = await userRepo.findOneBy({ email: email.trim().toLowerCase() });
        if (existingUser) {
            next(appError(409, "Email已被使用"));
            return;
        }
        //對密碼加密
        const hashPassword = await bcrypt.hash(password, 10);
        //寫入資料庫
        const user = await userRepo.save({
            name: name.trim(),
            email: email.trim(),
            password: hashPassword
        });
        res.status(201).json({
            status: "success",
            data: {
                user: {
                    id: user.id,
                    name: user.name
                }
            },
        });
    },
    // 登入會員
    async login(req, res, next) {
        const { email, password } = req.body;
        // 檢查欄位與密碼規則
        if (!isValidString(email) || !isValidString(password)) {
            next(appError(400, '欄位未正確填寫'));
            return;
        }
        if (!isValidPassword(password)) {
            next(appError(400, pw_err));
            return;
        }

        const userRepo = dataSource.getRepository("User");
        const user = await userRepo.findOneBy({ email: email.trim().toLowerCase() });

        if (!user) {
            next(appError(400, '使用者不存在或密碼輸入錯誤'));
            return;
        }

        // 比對密碼是否正確
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            next(appError(400, '使用者不存在或密碼輸入錯誤'));
            return;
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
            },
            get('secret.jwtSecret'),
            {
                expiresIn: get('secret.jwtExpiresDay'),
            });
        res.status(201).json({
            status: "success",
            data: {
                token,
                user: {
                    name: user.name
                }
            }
        });
        return;

    },



};
module.exports = userController;

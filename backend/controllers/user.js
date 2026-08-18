const { dataSource } = require("../db/data-source");
const appError = require("../utils/appError");
const { isValidString, isValidPassword, isInteger } = require("../utils/validUtils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require('../config/index')

const pw_err = '密碼不符合規則，需包含英文大小寫及數字，字數在8~16字之間'

const userController = {
    // 取得所有會員資訊
    async getUsers(req, res, next) {
        const users = await dataSource.getRepository("User").find({
            select: { id: true, name: true, email: true, role: true, credit_balance: true },
            order: { created_at: "ASC" },
        });
        res.json({ status: "success", data: users });
        return;
    },

    // 註冊新會員
    async signup(req, res, next) {
        const { name, email, password } = req.body;
        // 檢查姓名、Email和密碼格式
        if (!isValidString(name) || !isValidString(email) || !isValidString(password)) {
            next(appError(400, '欄未為正確填寫'));
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
            }
        });
    },




};
module.exports = userController;

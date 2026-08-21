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
        res.json({
            status: 'success',
            data: {
                user: {
                    name: req.user.name,
                    email: req.user.email,
                }
            }
        });
        return;
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
    // 更新暱稱
    async changeName(req, res, next) {
        const newName = req.body.name;
        //檢查欄位
        if (!isValidString(newName)) {
            next(appError(400, '欄位未正確填寫'));
            return;
        }
        // 檢查暱稱是否與原本相同
        if (newName == req.user.name) {
            next(appError(400, '使用者名稱未變更'));
            return;
        }

        //讀取資料庫
        const userRepo = dataSource.getRepository("User");
        //更新資料
        const result = await userRepo.update(
            { id: req.user.id },
            { name: newName });
        if (result.affected === 0) {
            next(appError(400, '更新使用者資料失敗'));
            return;
        }

        res.status(200).json({
            status: "success",
            data: {
                user: {
                    name: newName
                }
            }
        });
        return;
    },

    // 變更密碼
    async changePassword(req, res, next) {
        const { password, new_password, confirm_new_password } = req.body;
        // 檢查欄位
        if (!isValidString(password) || !isValidString(new_password) || !isValidString(confirm_new_password)) {
            next(appError(400, '欄位未正確填寫'));
            return;
        }
        // 檢查是否再次輸入正確
        if (new_password !== confirm_new_password) {
            next(appError(400, '新密碼與驗證新密碼不一致'));
            return;
        }
        // 檢查密碼是否符合規則
        if (!isValidPassword(password) || !isValidPassword(new_password) || !isValidPassword(confirm_new_password)) {
            next(appError(400, pw_err));
            return;
        }
        // 檢查新密碼是否與舊密碼相同
        if (password === new_password) {
            next(appError(400, '新密碼不能與舊密碼相同'));
            return;
        }

        // 檢查舊密碼是否正確
        const isMatch = await bcrypt.compare(password, req.user.password);
        if (!isMatch) {
            next(appError(400, '密碼輸入錯誤'));
            return;
        }
        const hashPassword = await bcrypt.hash(new_password, 10);
        // 讀取資料庫
        const userRepo = dataSource.getRepository("User");
        // 更新資料
        const result = await userRepo.update(
            { id: req.user.id },
            { password: hashPassword });
        if (result.affected === 0) {
            next(appError(400, '更新密碼失敗'));
            return;
        }

        res.status(200).json({
            status: "success",
            data: {
                user: {
                    name: req.user.name
                }
            }
        });
        return;
    },

    // 查看購買課程方案紀錄
    async getPurchaseRecords(req, res, next) {
        const { id } = req.user;
        const creditPurchaseRepo = dataSource.getRepository("CreditPurchase");
        const purchaseRecords = await creditPurchaseRepo.find({
            where: { user_id: id },
            relations: { credit_package: true },
            order: { createdAt: "DESC" },
        });

        const purchaseRecordList = purchaseRecords.map((record) => {
            return {
                name: record.credit_package.name,
                purchased_credits: record.purchase_credits,
                price_paid: record.price_paid,
                purchase_at: record.createdAt,
            };
        });

        res.json({ status: "success", data: purchaseRecordList });
        return;
    }



};
module.exports = userController;

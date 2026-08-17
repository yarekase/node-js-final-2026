// controllers/skill.js
const { dataSource } = require("../db/data-source");
const appError = require("../utils/appError");
const { isValidString, isValidPassword, isInteger } = require("../utils/validUtils");

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

    // 登入會員
    async getUser(req, res, next) {
        const { email, password } = req.body;
        if (!isValidString(email) || !isValidPassword(password)) {
            next(appError(400, "欄位未填寫正確"));
            return;
        }
        const userRepo = dataSource.getRepository("User");
        const user = await userRepo.findOneBy({ email: email.trim() });
        if (!user) {
            next(appError(404, "查無此會員"));
            return;
        }
        res.json({ status: "success", data: user });
    },

    // 註冊新會員
    async postUser(req, res, next) {
        const { name, email, password } = req.body;
        if (!isValidString(name) || !isValidString(email) || !isValidPassword(password)) {
            next(appError(400, "欄位未填寫正確"));
            return;
        }
        const userRepo = dataSource.getRepository("User");
        const existing = await userRepo.findOneBy({ email: email.trim() });
        if (existing) {
            next(appError(409, "資料重複"));
            return;
        }
        const user = await userRepo.save({ name: name.trim(), email: email.trim(), password: password });
        res.json({ status: "success", data: user });
    },

    async deleteSkill(req, res, next) {
        const { skillId } = req.params;
        const result = await dataSource.getRepository("Skill").delete(skillId);
        if (result.affected === 0) {
            next(appError(400, "ID錯誤"));
            return;
        }
        res.json({ status: "success" });

    },
};
module.exports = skillController;

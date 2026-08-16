// controllers/skill.js
const { dataSource } = require("../db/data-source");
const appError = require("../utils/appError");
const { isValidString, isValidPassword, isInteger } = require("../utils/validUtils");

const userController = {
    async getUsers(req, res, next) {
        const users = await dataSource.getRepository("User").find({
            select: { id: true, name: true, email: true, role: true, credit_balance: true },
            order: { created_at: "ASC" },
        });
        res.json({ status: "success", data: users });
        return;
    },

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
        const skill = await skillRepo.save({ name: name.trim() });
        res.json({ status: "success", data: skill });
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

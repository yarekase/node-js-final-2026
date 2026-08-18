const { dataSource } = require("../db/data-source");
const appError = require("../utils/appError");
const { isValidString, isValidInteger } = require("../utils/validUtils");

const coachController = {
    async roleConvert(req, res, next) {

        const {
            experience_years,
            description,
            profile_image_url,
        } = req.body;

        if (!isValidInteger(experience_years) || !isValidString(description)) {
            next(appError(400, "欄位未填寫正確"));
            return;
        }

        if (profile_image_url && (!isValidString(profile_image_url) || !profile_image_url.starsWith('https://'))) {
            next(appError(400, "欄位未填寫正確"));
            return;
        }

        const { userId } = req.params;
        const userRepo = dataSource.getRepository(User);
        const coachRepo = dataSource.getRepository(Coach);
        const user = await userRepo.findOneBy({ id: userId });
        if (!user) {
            next(appError(400, "使用者不存在"));
            return;
        }

        const isExisting = await coachRepo.findOneBy({ user_id: userId });
        if (isExisting) {
            next(appError(409, "使用者已是教練"));
            return;
        }

        const result = await userRepo.update(
            { id: userId },
            { role: 'COACH' });
        if (result.affected === 0) {
            next(appError(400, '更新使用者資料失敗'));
            return;
        }

        const newCoach = coachRepo.create({
            user_id: userId,
            experience_years,
            description,
            profile_image_url: profile_image_url || '',
        });

        await coachRepo.save(newCoach);

        res.status(201).json({
            status: "success",
            data: {
                user: {
                    name: user.name,
                    role: 'COACH'
                },
                coach: {
                    id: newCoach.id,
                    user_id: userId,
                    experience_years,
                    description,
                    profile_image_url: profile_image_url || '',
                    created_at: newCoach.createdAt,
                    updated_at: newCoach.updatedAt,
                }
            }
        });
        return;


    },

};
module.exports = skillController;

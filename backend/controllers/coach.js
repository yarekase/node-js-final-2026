const { dataSource } = require("../db/data-source");
const appError = require("../utils/appError");
const { isValidString, isValidInteger } = require("../utils/validUtils");
const { In } = require("typeorm");

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

        if (profile_image_url && (!isValidString(profile_image_url) || !profile_image_url.startsWith('https://'))) {
            next(appError(400, "欄位未填寫正確"));
            return;
        }

        const { userId } = req.params;
        const userRepo = dataSource.getRepository('User');
        const coachRepo = dataSource.getRepository('Coach');
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
    // 取得登入教練資訊
    async getCoachProfile(req, res, next) {
        const coachRepo = dataSource.getRepository('Coach');
        const coach = await coachRepo.findOneBy({ user_id: req.user.id });
        const coachLinkSkillRepo = dataSource.getRepository('CoachLinkSkill');
        const coachSkillIds = await coachLinkSkillRepo.findBy({ coach_id: coach.id });
        const skill_ids = coachSkillIds.map(item => item.skill_id);
        res.json({
            status: 'success',
            data: {
                id: coach.id,
                experience_years: coach.experience_years,
                description: coach.description,
                profile_image_url: coach.profile_image_url || '',
                skill_ids
            }
        });
        return;
    },

    // 更新教練後台資料
    async updateCoachProfile(req, res, next) {

        const { experience_years, description, profile_image_url, skill_ids } = req.body;

        if (!isValidInteger(experience_years) || !isValidString(description)) {
            next(appError(400, "欄位未填寫正確"));
            return;
        }

        if (!profile_image_url || !isValidString(profile_image_url) || !profile_image_url.startsWith('https://')) {
            next(appError(400, "欄位未填寫正確"));
            return;
        }

        // 驗證skill_ids是陣列且非空陣列
        if (!Array.isArray(skill_ids) || skill_ids.length === 0) {
            next(appError(400, "欄位未填寫正確"));
            return;
        }
        const skillRepo = dataSource.getRepository("Skill");
        const existingSkillIds = await skillRepo.findBy({ id: In(skill_ids) });

        // 確認skill_ids與資料庫中相同的數量一致
        if (skill_ids.length !== existingSkillIds.length) {
            next(appError(400, "欄位未填寫正確"));
            return;
        }

        const coachRepo = dataSource.getRepository("Coach");
        const coach = await coachRepo.findOneBy({ user_id: req.user.id });
        const coachData = await coachRepo.update(
            { id: coach.id },
            { experience_years, description, profile_image_url }
        );

        if (coachData.affected === 0) {
            next(appError(400, '欄位未填寫正確'));
            return;
        }

        const coachLinkSkillRepo = dataSource.getRepository('CoachLinkSkill');
        await coachLinkSkillRepo.delete({ coach_id: coach.id });

        const coachSkills = skill_ids.map((skill_id) =>
            coachLinkSkillRepo.create({
                coach_id: coach.id,
                skill_id,
            }));
        await coachLinkSkillRepo.save(coachSkills);

        res.status(200).json({
            status: 'success',
            data: {
                id: coach.id,
                experience_years,
                description,
                profile_image_url,
                skill_ids
            }
        });
        return;

    },

    // 取得教練本人開設的全部課程
    async getCoachCourses(req, res, next) {
        const coachRepo = dataSource.getRepository('Coach');
        const courseRepo = dataSource.getRepository('Course');
        const coach = await coachRepo.findOneBy({ user_id: req.user.id });
        const courses = await courseRepo.findBy({ coach_id: coach.id });
        res.json({
            status: 'success',
            data: courses
        });
        return;
    },

};
module.exports = coachController;

const { dataSource } = require("../db/data-source");
const appError = require("../utils/appError");
const { isValidString, isValidInteger } = require("../utils/validUtils");
const { MoreThan, LessThan } = require("typeorm");

const pobController = {

    // (公開)取得所有教練列表
    async getAllCoaches(req, res, next) {
        const { per, page } = req.query;

        if (!per || !page) {
            next(appError(400, '欄位未填寫正確'));
            return;
        }

        const perNum = Number(per);
        const pageNum = Number(page);

        if (!isValidInteger(perNum) || !isValidInteger(pageNum)) {
            next(appError(400, '欄位未填寫正確'));
            return;
        }

        const skip = (pageNum - 1) * perNum;

        const coachRepo = dataSource.getRepository("Coach");
        const allCoaches = await coachRepo.find({
            skip,
            take: perNum,
            relations: {
                user: true
            }
        });

        const coaches = allCoaches.map(coach => {
            return {
                id: coach.id,
                user_id: coach.user_id,
                name: coach.user.name
            }
        });

        res.status(200).json({
            status: 'success',
            data: coaches
        });
    },

    // (公開)取得單一教練詳細資料
    async getOneCoach(req, res, next) {
        const { coachId } = req.params;

        if (!isValidString(coachId)) {
            next(appError(400, '欄位未填寫正確'));
            return;
        }

        const coachRepo = dataSource.getRepository("Coach");
        const coach = await coachRepo.findOne({
            where: { id: coachId },
            relations: {
                user: true
            }
        });

        if (!coach) {
            next(appError(404, '查無此教練'));
            return;
        }

        const coachLinkSkillRepo = dataSource.getRepository('CoachLinkSkill');
        const coachSkillIds = await coachLinkSkillRepo.find({
            where: {
                coach_id: coach.id
            },
            relations: {
                skill: true
            }
        });

        const skills = coachSkillIds.map(item => item.skill.name);

        if (!skills) {
            next(appError(400, '此教練無能'));
            return;
        }

        res.status(200).json({
            status: 'success',
            data: {
                user: {
                    name: coach.user.name,
                    role: coach.user.role
                },
                coach: {
                    id: coach.id,
                    user_id: coach.user_id,
                    experience_years: coach.experience_years,
                    description: coach.description,
                    profile_image_url: coach.profile_image_url || '',
                    created_at: coach.created_at,
                    updated_at: coach.updated_at,
                    skills
                }
            }
        });
    },

    async getCoachCourses(req, res, next) {
        const { coachId } = req.params;

        if (!isValidString(coachId)) {
            next(appError(400, '欄位未填寫正確'));
            return;
        }

        const courseRepo = dataSource.getRepository("Course");
        const coursesNotEnd = await courseRepo.find({
            where: {
                coach_id: coachId,
                endAt: MoreThan(new Date())
            },
            relations: {
                coach: {
                    user: true
                },
                skill: true
            }
        });

        const courses = coursesNotEnd.map(course => {
            return {
                id: course.id,
                name: course.name,
                description: course.description,
                start_at: course.startAt,
                end_at: course.endAt,
                max_participants: course.max_participants,
                coach_name: course.coach.user.name,
                skill_name: course.skill.name
            }
        });

        res.status(200).json({
            status: 'success',
            data: courses
        });
    },

    // (公開)取得所有進行中的課程
    async getLivingCourses(req, res, next) {
        console.log('進入getLivingCourses')
        const courseRepo = dataSource.getRepository("Course");
        const coursesNotEnd = await courseRepo.find({
            where: {
                startAt: LessThan(new Date()),
                endAt: MoreThan(new Date())
            },
            relations: {
                coach: {
                    user: true
                },
                skill: true
            }
        });

        const courses = coursesNotEnd.map(course => {

            return {
                id: course.id,
                name: course.name,
                description: course.description,
                start_at: course.startAt,
                end_at: course.endAt,
                max_participants: course.max_participants,
                coach_name: course.coach.user.name,
                skill_name: course.skill.name
            }
        });

        res.status(200).json({
            status: 'success',
            data: courses
        });

    }


};
module.exports = pobController;

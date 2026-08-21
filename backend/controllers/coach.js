const { dataSource } = require("../db/data-source");
const appError = require("../utils/appError");
const { isValidString, isValidInteger } = require("../utils/validUtils");
const { In, IsNull } = require("typeorm");

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
    },

    // 更新教練後台資料
    async updateCoachProfile(req, res, next) {

        const { experience_years, description, profile_image_url, skill_ids } = req.body;

        if (!isValidInteger(experience_years) || !isValidString(description)) {
            next(appError(400, "欄位未填寫正確"));
            return;
        }

        if (!isValidString(profile_image_url) || !profile_image_url.startsWith('https://')) {
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
    },

    // 取得教練本人開設的全部課程
    async getCoachCourses(req, res, next) {
        console.log('進入getCoachCourses');
        const courseRepo = dataSource.getRepository('Course');
        const courses = await courseRepo.find({
            where: {
                coach: {
                    user_id: req.user.id
                }
            }
        });
        const courseBookingRepo = dataSource.getRepository('CourseBooking');

        const now = new Date().getDate();
        const courseWithDetails = await Promise.all(
            courses.map(async course => {
                const startAt = course.startAt.getTime();
                const endAt = course.endAt.getTime();
                let status = '尚未開始';

                if (now > endAt) {
                    status = '已結束';
                } else if (now >= startAt && now <= endAt) {
                    status = '進行中';
                }

                const participants = await courseBookingRepo.countBy({
                    course_id: course.id,
                    cancelledAt: IsNull()
                });

                return {
                    ...course,
                    status,
                    participants
                };
            }));

        res.json({
            status: 'success',
            data: courseWithDetails
        });

    },

    // 教練新增課程
    async addCourse(req, res, next) {
        console.log('進入addCourse');
        // 讀取body資料
        const {
            skill_id,
            name,
            description,
            start_at,
            end_at,
            max_participants,
            meeting_url
        } = req.body

        // 驗證欄位格式
        if (!isValidString(skill_id) ||
            !isValidString(name) ||
            !isValidString(description) ||
            !isValidString(start_at) ||
            !isValidString(end_at) ||
            !isValidInteger(max_participants) ||
            !isValidString(meeting_url) ||
            !meeting_url.startsWith('https://')
        ) {
            next(appError(400, "欄位未填寫正確"));
            return;
        }

        // 驗證skill_id在資料庫裡存在
        const skillRepo = dataSource.getRepository("Skill");
        const skill = await skillRepo.findOneBy({ id: skill_id });

        if (!skill) {
            next(appError(400, "欄位未填寫正確"));
            return;
        }

        const coachRepo = dataSource.getRepository('Coach');
        const coach = await coachRepo.findOneBy({ user_id: req.user.id });

        const courseRepo = dataSource.getRepository('Course');
        const addedCourse = courseRepo.create({
            coach_id: coach.id,
            skill_id,
            name,
            description,
            startAt: start_at,
            endAt: end_at,
            max_participants,
            meeting_url
        })
        await courseRepo.save(addedCourse);

        res.status(201).json({
            status: 'success',
            data: {
                course: {
                    id: addedCourse.id,
                    user_id: coach.user_id,
                    skill_id: addedCourse.skill_id,
                    name: addedCourse.name,
                    description: addedCourse.description,
                    start_at: addedCourse.start_at,
                    end_at: addedCourse.end_at,
                    max_participants: addedCourse.max_participants,
                    meeting_url: addedCourse.meeting_url,
                    created_at: addedCourse.created_at,
                    updated_at: addedCourse.updated_at
                }
            }
        });
    },

    // 取得教練自己開的單一課程資訊
    async getCoachCourse(req, res, next) {
        const { course_id } = req.params;

        if (!isValidString(course_id)) {
            next(appError(400, "課程不存在"));
            return;
        }

        const courseRepo = dataSource.getRepository('Course');
        const coachRepo = dataSource.getRepository('Coach');
        // 查token裡的id得到的教練資訊
        const coach = await coachRepo.findOneBy({ user_id: req.user.id });
        // 查course_id跟 coach_id 相同的課程
        const course = await courseRepo.findOne({
            where: { id: course_id, coach_id: coach.id },
            relations: {
                skill: true
            }
        });

        if (!course) {
            next(appError(400, '課程不存在'));
            return;
        }

        res.status(200).json({
            status: 'success',
            data: {
                id: course.id,
                name: course.name,
                description: course.description,
                startAt: course.start_at,
                endAt: course.end_at,
                max_participants: course.max_participants,
                skill_name: course.skill.name,
                skill_id: course.skill.id,
                meeting_url: course.meeting_url

            }
        });
    },

    // 更新單一課程
    async updateCoachCourse(req, res, next) {
        const { course_id } = req.params;

        if (!isValidString(course_id)) {
            next(appError(400, "課程不存在"));
            return;
        }

        const courseRepo = dataSource.getRepository('Course');
        const coachRepo = dataSource.getRepository('Coach');
        // 查token裡的id得到的教練資訊
        const coach = await coachRepo.findOneBy({ user_id: req.user.id });
        // 查course_id跟 coach_id 相同的課程
        const course = await courseRepo.findOneBy({ id: course_id, coach_id: coach.id });

        if (!course) {
            next(appError(400, '課程不存在'));
            return;
        }

        const {
            skill_id,
            name,
            description,
            start_at,
            end_at,
            max_participants,
            meeting_url
        } = req.body;

        // 驗證欄位格式
        if (!isValidString(skill_id) ||
            !isValidString(name) ||
            !isValidString(description) ||
            !isValidString(start_at) ||
            !isValidString(end_at) ||
            !isValidInteger(max_participants) ||
            !isValidString(meeting_url) ||
            !meeting_url.startsWith('https://')
        ) {
            next(appError(400, "欄位未填寫正確"));
            return;
        }

        // 驗證skill_id在資料庫裡存在
        const skillRepo = dataSource.getRepository("Skill");
        const skill = await skillRepo.findOneBy({ id: skill_id });

        if (!skill) {
            next(appError(400, "欄位未填寫正確"));
            return;
        }

        const updatedCourse = await courseRepo.update(
            { id: course_id },
            {
                skill_id,
                name,
                description,
                startAt: start_at,
                endAt: end_at,
                max_participants,
                meeting_url
            }
        );

        if (updatedCourse.affected === 0) {
            next(appError(400, '欄位未填寫正確'));
            return;
        }

        res.status(200).json({
            status: 'success',
            data: {
                id: course_id,
                user_id: req.user.id,
                skill_id,
                name,
                description,
                start_at,
                end_at,
                max_participants,
                meeting_url,
                createdAt: course.createdAt,
                updatedAt: course.updatedAt
            }
        });
    },

    // (公開)取得所有教練列表
    async getAllCoaches(req, res, next) {
        console.log('進來getAllcoaches了')
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
            data: {
                coaches
            }
        });
    }


};
module.exports = coachController;

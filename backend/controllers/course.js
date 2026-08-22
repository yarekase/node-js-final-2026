const { dataSource } = require("../db/data-source");
const appError = require("../utils/appError");
const { isValidString } = require("../utils/validUtils");

const courseController = {
    async bookCourse(req, res, next) {

        const { courseId } = req.params;
        const { id } = req.user;

        if (!isValidString(courseId)) {
            next(appError(400, '課程ID無效'));
            return;
        }

        const courseRepo = dataSource.getRepository('Course');
        const course = await courseRepo.findOneBy({ id: courseId });
        if (!course) {
            next(appError(400, '查無此課程'));
            return;
        }

        const courseBookingRepo = dataSource.getRepository('CourseBooking');
        // 獲得特定課程登記資料(包含取消/結束的)
        const courseBookings = await courseBookingRepo.find({
            where: { course_id: courseId }
        });
        // 獲得使用者登記過的資料
        const userBookings = await courseBookingRepo.find({
            where: { user_id: id }
        });

        // 檢查是否曾經預約過此課程
        const existingBooking = userBookings.some(booking =>
            booking.course_id === courseId && booking.cancelledAt === null);
        if (existingBooking) {
            next(appError(400, '已經報名過此課程'));
            return;
        }

        // 檢查有沒有剩餘堂數：先查總購買堂數，再查已經取消跟結束的課程堂數
        const creditPurchaseRepo = dataSource.getRepository('CreditPurchase');
        const creditPurchase = await creditPurchaseRepo.find({
            where: { user_id: id }
        });
        // 購買的總堂數
        const creditPurchaseAmount = creditPurchase.reduce((acc, curr) => acc + curr.purchased_credits, 0);
        // 已預約且未取消的堂數
        const userBookingAmount = userBookings.reduce((acc, curr) => curr.cancelledAt === null ? acc + 1 : acc, 0);

        // 檢查有沒有剩餘堂數
        if (creditPurchaseAmount <= userBookingAmount) {
            next(appError(400, '已無可使用堂數'));
            return;
        }

        // 檢查是否報名額滿
        const courseBookingActive = courseBookings.filter(booking => !booking.cancelledAt)

        const courseBookingAmount = courseBookingActive.length;

        if (courseBookingAmount >= course.max_participants) {
            next(appError(400, '已達最大參加人數，無法參加'));
            return;
        }

        const newBooking = courseBookingRepo.create({
            course_id: courseId,
            user_id: id,
            credit_used: 1,
        });

        await courseBookingRepo.save(newBooking);

        res.status(201).json({
            status: 'success',
            data: null
        });
    },

};
module.exports = courseController;
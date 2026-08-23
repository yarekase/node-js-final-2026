const { EntitySchema } = require('typeorm')

module.exports = new EntitySchema({
    name: 'CourseBooking',
    tableName: 'COURSE_BOOKINGS',
    columns: {
        id: {
            primary: true,
            type: 'uuid',
            generated: 'uuid',
            nullable: false,
        },
        user_id: {
            type: 'uuid',
            nullable: false,
        },
        course_id: {
            type: 'uuid',
            nullable: false,
        },
        createdAt: {
            name: 'created_at',
            type: 'timestamp',
            createDate: true,
            nullable: false,
        },
        cancelledAt: {
            name: 'cancelled_at',
            type: 'timestamp',
            nullable: true,
        },
    },
    relations: {
        user: {
            type: 'many-to-one',
            target: 'User',
            joinColumn: { name: 'user_id' },
        },
        course: {
            type: 'many-to-one',
            target: 'Course',
            joinColumn: { name: 'course_id' },
        },
    },
})

// entities/Course.js
const { EntitySchema } = require("typeorm");
module.exports = new EntitySchema({
    name: "Course",
    tableName: "COURSES",
    columns: {
        id: {
            primary: true,
            type: "uuid",
            generated: "uuid",
            nullable: false,
        },
        user_id: {
            type: "uuid",
            nullable: false,
            unique: true
        },
        skill_id: {
            type: "uuid",
            nullable: false
        },
        name: {
            type: "varchar",
            length: 50,
            nullable: false
        },
        startAt: {
            name: 'start_at',
            type: "timestamp",
            nullable: false,
        },
        endAt: {
            name: 'end_at',
            type: "timestamp",
            nullable: false,
        },
        max_participants: {
            type: "integer",
            nullable: false,
        },
    },
    relations: {
        user: {
            type: "one-to-one",
            target: "User",
            joinColumn: { name: "user_id" },
        },
        skill: {
            type: "one-to-one",
            target: "Skill",
            joinColumn: { name: "skill_id" },
        }
    },
});
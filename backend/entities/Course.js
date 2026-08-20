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
        coach_id: {
            type: "uuid",
            nullable: false,
        },
        skill_id: {
            type: "uuid",
            nullable: false
        },
        name: {
            type: "varchar",
            unique: true,
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
        meeting_url: {
            type: "varchar",
            length: 2048,
            nullable: true
        },
    },
    relations: {
        coach: {
            type: "one-to-one",
            target: "Coach",
            joinColumn: { name: "coach_id" },
        },
        skill: {
            type: "one-to-one",
            target: "Skill",
            joinColumn: { name: "skill_id" },
        }
    },
});
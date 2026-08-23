// entities/Course.js
const { EntitySchema } = require("typeorm");
module.exports = new EntitySchema({
    name: "CoachLinkSkill",
    tableName: "COACHS_LINK_SKILLS",
    columns: {
        coach_id: {
            type: "uuid",
            nullable: false,
            primary: true,
        },
        skill_id: {
            type: "uuid",
            nullable: false,
            primary: true,
        },
        createdAt: {
            name: 'created_at',
            type: "timestamp",
            createDate: true,
            nullable: false,
        },

    },
    relations: {
        coach: {
            type: "many-to-one",
            target: "Coach",
            joinColumn: { name: "coach_id" },
            onDelete: "CASCADE"
        },
        skill: {
            type: "many-to-one",
            target: "Skill",
            joinColumn: { name: "skill_id" },
            onDelete: "CASCADE"
        }
    },
});
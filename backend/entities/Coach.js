// entities/Coach.js
const { EntitySchema } = require("typeorm");
module.exports = new EntitySchema({
    name: "Coach",
    tableName: "COACHES",
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
        experience_years: {
            type: "integer",
            nullable: false,
            default: 0
        },
        description: {
            type: "text",
            nullable: true
        },
        profile_image_url: {
            type: "varchar",
            length: 2048,
            nullable: true
        },
        createdAt: {
            name: 'created_at',
            type: "timestamp",
            createDate: true,
            nullable: false,
        },
        updatedAt: {
            name: 'updated_at',
            type: "timestamp",
            updateDate: true,
            nullable: false,
        },
    },
    relations: {
        user: {
            type: "one-to-one",
            target: "User",
            joinColumn: { name: "user_id" },
        },
    },
});
// entities/User.js
const { EntitySchema } = require("typeorm");
module.exports = new EntitySchema({
    name: "User",
    tableName: "USERS",
    columns: {
        id: {
            primary: true,
            type: 'uuid',
            generated: 'uuid',
            nullable: false,
        },
        name: {
            type: "varchar",
            length: 50,
            nullable: false
        },
        email: {
            type: "varchar",
            length: 320,
            nullable: false,
            unique: true
        },
        password: {
            type: "varchar",
            length: 255,
            nullable: false
        },
        role: {
            type: "varchar",
            length: 20,
            nullable: false,
            default: "USER"
        },
        createdAt: {
            name: 'create_at',
            type: "timestamp",
            createDate: true
        },
        updatedAt: {
            name: 'update_at',
            type: "timestamp",
            updateDate: true
        },
    },
});
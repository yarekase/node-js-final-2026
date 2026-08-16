// entities/Course.js
const { EntitySchema } = require("typeorm");
module.exports = new EntitySchema({
    name: "CreditPurchase",
    tableName: "CREDIT_PURCHASES",
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
        credit_package_id: {
            type: "uuid",
            nullable: false
        },
        purchase_credits: {
            type: "integer",
            nullable: false
        },
        price_paid: {
            type: "integer",
            nullable: false,
        },
        createdAt: {
            name: 'created_at',
            type: "timestamp",
            createDate: true,
            nullable: false,
        },
    },
    relations: {
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: { name: "user_id" },
        },
        credit_package: {
            type: "many-to-one",
            target: "CreditPackage",
            joinColumn: { name: "credit_package_id" },
        }
    },
});
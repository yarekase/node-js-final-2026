const { EntitySchema } = require('typeorm')

module.exports = new EntitySchema({
    name: 'Skill',        // 程式裡的名字：getRepository('CreditPackage') 用它
    tableName: 'SKILL',  // 資料庫裡實際的表名
    columns: {
        id: {
            primary: true,
            type: 'uuid',
            generated: 'uuid',
            nullable: false,
        },
        name: {
            type: 'varchar',
            length: 50,
            nullable: false,
            unique: true,
        },
        createdAt: {
            name: 'created_at',
            type: 'timestamp',
            createDate: true,
            nullable: false,
        },
        updatedAt: {
            name: 'updated_at',
            type: 'timestamp',
            updateDate: true,
            nullable: false,
        },
    },
})

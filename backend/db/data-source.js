require('dotenv').config()
const { DataSource } = require('typeorm')
const { get } = require('../config/index')

const CreditPackage = require('../entities/CreditPackage')
const Skill = require('../entities/Skill')
const Coach = require('../entities/Coach')
const User = require('../entities/User')
const Course = require('../entities/Course')
const CourseBooking = require('../entities/CourseBooking')
const CreditPurchase = require('../entities/CreditPurchase')
const CoachLinkSkill = require('../entities/CoachLinkSkill')

const dataSource = new DataSource({
    type: 'postgres',
    host: get('db.host'),
    port: Number(get('db.port')),
    username: get('db.username'),
    password: get('db.password'),
    database: get('db.database'),
    synchronize: get('db.synchronize'),
    ssl: get('db.ssl'),
    entities: [
        CreditPackage,
        Skill,
        Coach,
        User,
        Course,
        CourseBooking,
        CreditPurchase,
        CoachLinkSkill,
    ],
    migrations: ['db/migrations/*.js'],
})

module.exports = { dataSource }

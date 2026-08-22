const { dataSource } = require('./data-source')

async function clearAll() {
    for (const name of ['Skill', 'CreditPackage']) {
        if (dataSource.hasMetadata(name)) {
            await dataSource.createQueryBuilder().delete().from(name).execute()
        }
    }
}

async function main() {
    await dataSource.initialize()
    await clearAll()

    const skillRepo = dataSource.getRepository('Skill')
    const userRepo = dataSource.getRepository('User')
    const packageRepo = dataSource.getRepository('CreditPackage')
    const coachRepo = dataSource.getRepository('Coach')
    const courseRepo = dataSource.getRepository('Course')
    const courseBookingRepo = dataSource.getRepository('CourseBooking')
    const creditPurchaseRepo = dataSource.getRepository('CreditPurchase')
    const coachLinkSkillRepo = dataSource.getRepository('CoachLinkSkill')

    // 1. 先種「被指著」的表：SKILL、USER（COURSE 的外來鍵指著它們）
    const [boxing, swimming, pilates] = await skillRepo.save([
        { name: '拳擊' },
        { name: '游泳' },
        { name: '皮拉提斯' },
    ])

    const [ming, hua] = await userRepo.save([
        { name: '大熊', email: 'bear@livefit.tw', password: 'Bear3333', role: 'student' },
        { name: '喇叭花教練', email: 'coach.bighua@livefit.tw', password: 'Acc1511456', role: 'coach' },
    ])

    const [package1, package2] = await packageRepo.save([
        { name: '7 堂組合包方案', credit_amount: 7, price: 1400 },
        { name: '14 堂組合包方案', credit_amount: 14, price: 2520 },
        { name: '21 堂組合包方案', credit_amount: 21, price: 4800 },
    ])

    // 2. 再種 COURSE：relation 直接塞整個物件，TypeORM 自己把 id 填進 user_id / skill_id
    const [coach1] = await coachRepo.save([
        { user: hua, experience_years: 1, description: '游泳教練' },
    ])

    await coachLinkSkillRepo.save([
        { coach: coach1, skill: swimming },
    ])

    const [course1] = await courseRepo.save([
        { coach: coach1, skill: swimming, name: '游泳課程', startAt: '2026-08-03 19:00:00', endAt: '2026-08-03 20:00:00', max_participants: 16 },
    ])

    const [courseBooking1] = await courseBookingRepo.save([
        { user: ming, course: course1, credit_used: 1 },
    ])

    const [creditPurchase1] = await creditPurchaseRepo.save([
        { user: ming, credit_package: package1, purchase_credits: 7, price_paid: 1400 },
    ])

    console.log('🌱 seed 完成')
    await dataSource.destroy()
}

main().catch((e) => { console.error('seed 失敗：', e.message); process.exit(1) })


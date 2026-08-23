const { dataSource } = require('./data-source')

async function clearAll() {
    for (const name of ['CreditPurchase', 'CourseBooking', 'CoachLinkSkill', 'Course', 'Coach', 'Skill', 'CreditPackage', 'User']) {
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
    const creditPackageRepo = dataSource.getRepository('CreditPackage')
    const coachRepo = dataSource.getRepository('Coach')
    const courseRepo = dataSource.getRepository('Course')
    const courseBookingRepo = dataSource.getRepository('CourseBooking')
    const creditPurchaseRepo = dataSource.getRepository('CreditPurchase')
    const coachLinkSkillRepo = dataSource.getRepository('CoachLinkSkill')

    // 1. 先種「被指著」的表：SKILL、USER（COURSE 的外來鍵指著它們）
    const [boxing, swimming, pilates, reception, fitness, fishing] = await skillRepo.save([
        { name: '拳擊' },
        { name: '游泳' },
        { name: '皮拉提斯' },
        { name: '接待' },
        { name: '體適能' },
        { name: '摸魚' },
    ])

    const [bear, fish, snake, coach_hua, coach_wudang, coach_banqiao, coach_nangang] = await userRepo.save([
        { name: '大熊', email: 'bear@livefit.tw', password: 'Acc1511456', role: 'USER' },
        { name: '大魚', email: 'fish@livefit.tw', password: 'Acc1511456', role: 'USER' },
        { name: '大蛇', email: 'snake@livefit.tw', password: 'Acc1511456', role: 'USER' },
        { name: '喇叭花教練', email: 'coach.bighua@livefit.tw', password: 'Acc1511456', role: 'COACH' },
        { name: '武當張三豐', email: 'coach.wudang@livefit.tw', password: 'Acc1511456', role: 'COACH' },
        { name: '板橋郭台銘', email: 'coach.banqiao@livefit.tw', password: 'Acc1511456', role: 'COACH' },
        { name: '南港阿滴', email: 'coach.nangang@livefit.tw', password: 'Acc1511456', role: 'COACH' },
    ])

    const [package1, package2, package3] = await creditPackageRepo.save([
        { name: '7 堂組合包方案', credit_amount: 7, price: 1400 },
        { name: '14 堂組合包方案', credit_amount: 14, price: 2520 },
        { name: '21 堂組合包方案', credit_amount: 21, price: 4800 },
    ])

    // 2. 再種 COURSE：relation 直接塞整個物件，TypeORM 自己把 id 填進 user_id / skill_id
    const [coach1, coach2, coach3, coach4] = await coachRepo.save([
        { user: coach_hua, experience_years: 1, description: '游泳教練' },
        { user: coach_wudang, experience_years: 90, description: '太極拳教練' },
        { user: coach_banqiao, experience_years: 5, description: '員工教練' },
        { user: coach_nangang, experience_years: 2, description: '體適能教練' },
    ])

    await coachLinkSkillRepo.save([
        { coach: coach1, skill: swimming },
        { coach: coach1, skill: pilates },
        { coach: coach2, skill: boxing },
        { coach: coach3, skill: reception },
        { coach: coach3, skill: fishing },
        { coach: coach4, skill: fitness },
    ])

    const [swimmingcourse, divingcourse, waterpilatescourse, taichicourse, fishingcourse, fitnesscourse] = await courseRepo.save([
        { coach: coach1, skill: swimming, name: '游泳課程', startAt: '2026-09-03 19:00:00', endAt: '2026-09-03 20:00:00', max_participants: 16 },
        { coach: coach1, skill: swimming, name: '潛水課程', startAt: '2026-09-10 19:00:00', endAt: '2026-09-10 20:00:00', max_participants: 5 },
        { coach: coach1, skill: pilates, name: '水中瑜珈課程', startAt: '2026-09-23 19:00:00', endAt: '2026-09-23 20:00:00', max_participants: 30 },
        { coach: coach2, skill: boxing, name: '太極拳讓你老母不認得課程', startAt: '2026-09-25 12:00:00', endAt: '2026-09-25 20:00:00', max_participants: 50 },
        { coach: coach3, skill: fishing, name: '摸魚課程', startAt: '2026-09-01 12:00:00', endAt: '2026-09-01 20:00:00', max_participants: 1 },
        { coach: coach4, skill: fitness, name: '體適能課程', startAt: '2026-09-17 19:00:00', endAt: '2026-09-17 20:00:00', max_participants: 20 },

    ])

    await courseBookingRepo.save([
        { user: bear, course: swimmingcourse },
        { user: bear, course: divingcourse },
        { user: bear, course: waterpilatescourse },
        { user: bear, course: taichicourse },
        { user: bear, course: fitnesscourse },
        { user: fish, course: fishingcourse },
        { user: snake, course: divingcourse },
        { user: snake, course: waterpilatescourse },
        { user: snake, course: fitnesscourse },
    ])

    await creditPurchaseRepo.save([
        { user: bear, credit_package: package1, },
        { user: bear, credit_package: package2, },
        { user: bear, credit_package: package3, },
        { user: fish, credit_package: package1, },
        { user: snake, credit_package: package3, },
    ])

    console.log('🌱 seed 完成')
    await dataSource.destroy()
}

main().catch((e) => { console.error('seed 失敗：', e.message); process.exit(1) })


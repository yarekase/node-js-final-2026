const app = require('../app')
const { dataSource } = require('../db/data-source')

async function start() {
    const maxRetries = 5
    let count = 0

    // 💡 加上 Retry 迴圈，避免 DB 還沒準備好時容器直接死掉
    while (count < maxRetries) {
        try {
            if (!dataSource.isInitialized) {
                await dataSource.initialize()
                console.log('資料庫連線成功')
            }
            break // 連線成功就跳出迴圈
        } catch (err) {
            count++
            console.error(`資料庫連線失敗 (第 ${count} 次嘗試)`, err.message)
            if (count >= maxRetries) {
                console.error('達到最大重試次數，終止程序')
                process.exit(1) // 真的試了 5 次都連不上才退出
            }
            // 延遲 2 秒再連一次
            await new Promise((resolve) => setTimeout(resolve, 2000))
        }
    }

    app.listen(process.env.PORT || 8080, () => {
        console.log(`server 跑起來了：http://localhost:${process.env.PORT || 8080}`)
    })
}

start()

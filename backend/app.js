const express = require('express')
const cors = require('cors')
const { get } = require('./config/index')
const { dataSource } = require('./db/data-source')

const app = express()

app.use(cors())          // W3：前端在 3000、我們在 8080，沒它前端全被擋
app.use(express.json())

// M0：健康檢查——回純文字 OK，不是 JSON；路徑不在 /api 底下
app.get('/healthcheck', async (req, res) => {
    try {
        await dataSource.query('SELECT 1')
        res.status(200).send('OK')
    } catch (err) {
        res.status(503).send('Server Error')
    }
})

// 之後每完成一個里程碑，路由就多掛一條：
// app.use('/api/credit-package', require('./routes/creditPackage'))
app.use('/api/coaches/skill', require('./routes/skill'))
app.use('/api/credit-package', require('./routes/CreditPackage'))
app.use('/api/users', require('./routes/User'))


// 404
app.use((req, res, next) => {
    res.status(404).json({
        status: 'failed',
        message: '無此路由'
    })
    return
})

// 錯誤處理守門員
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({
        status: statusCode === 500 ? 'error' : 'failed',
        message: err.message || '伺服器錯誤'
    })
})

dataSource.initialize().then(() => {
    app.listen(get('web.port'), () => {
        console.log(`Server running on port ${get('web.port')}`)
    })
}).catch((err) => {
    console.error('資料庫連線失敗', err)
    process.exit(1)
})

module.exports = app

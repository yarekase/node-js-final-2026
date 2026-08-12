// JWT 密鑰與有效期限
module.exports = {
    jwtSecret: process.env.JWT_SECRET || "defaultsecret",
    jwtExpiresDay: process.env.JWT_EXPIRES_DAY || "30d",
};
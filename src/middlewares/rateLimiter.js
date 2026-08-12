const {rateLimit} = require('express-rate-limit')

const generalLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,

    standardHeaders: "draft-8",
    legacyHeaders: false,

    message:{
        success: false,
        message:"Too many request, Please try again later"
    }
})

const authLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,

    standardHeaders: "draft-8",
    legacyHeaders: false,

    message:{
        success: false,
        message: "Too many request, Please try again later"
    }
})

module.exports = {generalLimit, authLimit}
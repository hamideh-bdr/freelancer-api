const express = require("express")
const app = express()
app.use((req,res,next) => {
    console.log("INCOMING REQUEST:" ,req.method, req.originalUrl);
    next()
    
})
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./config/swagger')
const authRouter = require('./routes/v1/auth')
const projectRouter = require('./routes/v1/project')
const proposalRouter = require('./routes/v1/proposal')
const dashboardRouter = require('./routes/v1/dashboard')
const bookMarkMiddleware = require('./routes/v1/bookmark')



app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded())
app.use("/uploads" , express.static(path.join(__dirname ,"uploads")))
app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerSpec))
app.get("/ping", (req,res) => {
    console.log("PING ROUTE HIT");
    
    res.status(200).json({
        message: "PONG_FROM-PRODUCTION",
    })
})
app.use('/auth',authRouter)
app.use('/projects',projectRouter)
app.use('/proposals',proposalRouter)
app.use('/bookmarks',bookMarkMiddleware)
app.use('/dashboards',dashboardRouter)
app.use((req,res) => {
    res.status(404).json({
        message: `Route not found: ${req.method} ${req.originalUrl}`
    })
})


module.exports = app 

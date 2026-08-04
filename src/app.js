const express = require("express")
const app = express()
const authRouter = require('./routes/v1/auth')
const projectRouter = require('./routes/v1/project')
const proposalRouter = require('./routes/v1/proposal')
const dashboardRouter = require('./routes/v1/dashboard')
const bookMarkMiddleware = require('./routes/v1/bookmark')

app.use(express.json())
app.use(express.urlencoded())
app.use('/authentication',authRouter)
app.use('/projects',projectRouter)
app.use('/proposals',proposalRouter)
app.use('/bookmarks',bookMarkMiddleware)


module.exports = app 

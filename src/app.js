const express = require("express")
const app = express()
const authRouter = require('./routes/v1/auth')
const projectRouter = require('./routes/v1/project')
const proposalRouter = require('./routes/v1/proposal')
const dashboardRouter = require('./routes/v1/dashboard')

app.use(express.json())
app.use(express.urlencoded())
app.use('/authentication',authRouter)
app.use('/projects',projectRouter)
app.use('/proposals',proposalRouter)
app.use('/dashboard',dashboardRouter)


module.exports = app 

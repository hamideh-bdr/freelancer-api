const express = require("express")
const app = express()
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


app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded())
app.use("/uploads" , express.static(path.join(__dirname ,"uploads")))
app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerSpec))
app.get("/swagger.json", (req, res) => {
  res.json(swaggerSpec);
});
app.use('/auth',authRouter)
app.use('/projects',projectRouter)
app.use('/proposals',proposalRouter)
app.use('/bookmarks',bookMarkMiddleware)
app.use('/dashboards',dashboardRouter)


module.exports = app 

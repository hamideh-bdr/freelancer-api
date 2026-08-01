const app = require('./src/app')
require('dotenv').config()
const connectDB = require('./src/config/db')
const port = process.env.PORT;

const startServer = async() => {
    await connectDB();

    app.listen( port , () => {
    console.log(`Server running on ${port} `)
})
}

startServer()



const swaggerJsdoc = require("swagger-jsdoc")

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Freelancer API",
            version: "1.0.0",
            description: "Freelancer Backend API Documentation"
        },
        servers: [
            {
                url: "https://freelancer-api-jhqh.onrender.com",
                description: "Production"
            },
            {
                url: "http://localhost:4002",
                description: "Development"
            }
        ]
    },
    apis: ["./src/routes/**/*.js"]
}

module.exports = swaggerJsdoc(options)
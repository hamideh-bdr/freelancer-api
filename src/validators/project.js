const validator = require('fastest-validator')
const { default: mongoose } = require('mongoose')
const v = new validator()
const schema = {
    title:{
        type: "string",
        required: true,
        min: 5
    },
    description:{
        type: "string",
        required: true,
        min: 20
    },
    budget:{
        type: "number",
        optional: true,
        min: 0
    },
    deliveryDays:{
        type: "number",
        optional: true
    },
    category:{
        type: "string",
        required: true
    }
}

const result = v.compile(schema)
module.exports = result
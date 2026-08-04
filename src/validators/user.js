const validator = require('fastest-validator')
const v = new validator()

const schema ={
    name:{
        type : "string",
        required: true,
        min: 3
    },
    username:{
        type : "string",
        required: true,
        min:4
    },
    email:{
        type : "string",
        required: true
    },
    phone:{
        type : "string",
        required: true,
        max: 11
    },
    password:{
        type : "string",
        required: true,
        min: 8
    },
    avatar:{
        type: "string",
        optional: true
    }
}


const result = v.compile(schema)
module.exports = result
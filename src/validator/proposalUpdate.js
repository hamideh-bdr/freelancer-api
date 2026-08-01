const validator = require('fastest-validator')
const v = new validator()
const schema = {
    budget:{
        type: "number",
        min:0,
        optional: true
    },
    message:{
        type: "string",
        min:10,
        optional: true
    },
    status:{
        type: "string",
        enum: ["PENDING","ACCEPTED","REJECTED"],
    }
}
const result = v.compile(schema)
module.exports = result

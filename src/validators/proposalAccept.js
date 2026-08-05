const validator = require('fastest-validator')
const v = new validator()

const schema = {
    status:{
        type: "string",
        enum: ["PENDING","ACCEPTED","REJECTED"],
    }

}

const result = v.compile(schema)
module.exports = result
const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    budget:{
        type: Number,
    },
    deliveryDays:{
        type: Number,
    },
    owner:{
        type: mongoose.Types.ObjectId,
        ref:"User",
        required: true
    },
    status:{
        type: String,
        enum:["OPEN","IN_PROGRESS","COMPLETED"],
        default:"OPEN"
    },
    category:{
        type: String,
        required: true
    },
    images:{
        type: [String],
        default: []
    }
},{timestamps: true})

const model = mongoose.model("Project",schema)
module.exports = model

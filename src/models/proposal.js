const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    user:{
        type: mongoose.Types.ObjectId,
        ref:'User',
        required: true
    },
    project:{
        type: mongoose.Types.ObjectId,
        ref:'Project',
        required: true
    },
    budget:{
        type: Number,
        min: 0
    },
    message:{
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: ["PENDING","ACCEPTED","REJECTED"],
        default: "PENDING"
    }
},{timestamps: true})

const model = mongoose.model('Proposal',schema)
module.exports = model
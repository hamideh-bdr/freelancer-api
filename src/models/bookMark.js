const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    project:{
        type: mongoose.Types.ObjectId,
        ref: "Project",
        required: true
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    }
},{timestamps: true})

const model = mongoose.model('Bookmark', schema)

module.exports = model
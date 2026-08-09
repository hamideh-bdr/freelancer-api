const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    tokenHash:{
        type: String,
        required: true
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    revokedAt:{
        type: Date,
        default: null
    },
    expiresAt:{
        type: Date,
        required: true
    }
},{timestamps: true})

const model = mongoose.model('RefreshToken' , schema)

module.exports = model
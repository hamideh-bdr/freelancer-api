const mongoose = require('mongoose')

const connectDB = async function (){
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log('connect to DB');

    }catch(err){
        console.log(err.message);
        
    }
    
}


module.exports = connectDB

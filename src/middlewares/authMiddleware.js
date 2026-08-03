const jwt = require('jsonwebtoken')
const userModel = require('./../models/user')


module.exports = async (req,res,next) => {
    const authHeader = req.header('Authorization')?.split(" ")
    if(authHeader?.length !== 2){
        return res.status(401).json({
            success: false,
            message: 'you cant access',
            data:null
        })
    }
    
    const token = authHeader[1]
    
    try{        
        const jwtPayload = jwt.verify(token,process.env.JWT_SECRET)        
        
        const user = await userModel.findById( jwtPayload.id).lean()  
              
        req.user = user
        
        Reflect.deleteProperty(user,'password')        
        next()        
    }catch(error){
        return res.status(401).json(error)
    }
}
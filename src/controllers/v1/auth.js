const userModel = require('../../models/user')
const validator = require('../../validator/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.register = async (req ,res) => {
    const {name,username,email,phone,password} = req.body

    const validatorResult = validator(req.body)
    if(validatorResult!== true){
        return res.json(validatorResult)

    }

    const isUserExist = await userModel.findOne({
        $or:[{username},{email},{phone}]
    })
    if(isUserExist){
        return res.status(409).json({message:'user exist already'})
        
    }
   
    const hashedPassword = await bcrypt.hash(password,10)
    const register = await userModel.create({
        name,
        username,
        email,
        phone,
        password : hashedPassword
    })


    return res.status(201).json({
        success: true,
        message: "user created successfully",
        data: register
    })

}

exports.login = async (req,res) => {
    const {identifier,password} = req.body

    const user = await userModel.findOne({
        $or:[{username: identifier},{email:identifier}]
    })
    if(!user){
        return res.status(404).json({
            message: "user not found"
        })
    }

    const verifyPassword = await bcrypt.compare(password,user.password)    
    if(!verifyPassword){
        return res.status(401).json({
            message: "Invalid email or password!"
        })
    }

    const token = jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn: "30 days"})
    return res.status(200).json({
        message: "user login successfully!",
        data: token
    })
}

exports.getMe = async (req,res) => {
    
    return res.json(req.user)
    
}
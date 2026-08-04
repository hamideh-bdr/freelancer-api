const userModel = require('../../models/user')
const validator = require('../../validators/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.register = async (req ,res) => {
    const {name,username,email,phone,password} = req.body

    const validatorResult = validator(req.body)
    if(validatorResult!== true){
        return res.status(422).json({
            success: false,
            message: "Request Is Not Valid !",
            data: validatorResult})

    }

    const isUserExist = await userModel.findOne({
        $or:[{username},{email},{phone}]
    })
    if(isUserExist){
        return res.status(409).json({
            success: false,
            message:"user exist already",
            data: null
        })
        
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
            success: false,
            message: "user not found",
            data: null
        })
    }

    const verifyPassword = await bcrypt.compare(password,user.password)    
    if(!verifyPassword){
        return res.status(401).json({
            success: false,
            message: "Invalid email or password!",
            data: null
        })
    }

    const token = jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn: "30 days"})
    return res.status(200).json({
        success: true,
        message: "user login successfully!",
        data: token
    })
}

exports.getMe = async (req,res) => {
    return res.status(200).json({
        success: true,
        message: "User Profile Fetched Successfully !" ,
        data: req.user
    })
    
}
const userModel = require('../../models/user')
const refreshTokenModel = require('../../models/refreshToken')
const validator = require('../../validators/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

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

    const accessToken = jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn: "15m"})
    const refreshToken = jwt.sign({id:user._id},process.env.JWT_REFRESH_SECRET,{ expiresIn: "30d"})

    const hashedToken = await bcrypt.hash(refreshToken,10)
    const expiresAt = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
    )

    await refreshTokenModel.create({
        tokenHash: hashedToken,
        user: user._id,
        expiresAt 
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000
    })
    return res.status(200).json({
        success: true,
        message: "user login successfully!",
        data: accessToken
    })

}

exports.getMe = async (req,res) => {
    return res.status(200).json({
        success: true,
        message: "User Profile Fetched Successfully !" ,
        data: req.user
    })
    
}

exports.uploadAvatar = async (req,res) => {
    const updateUser = await userModel.findByIdAndUpdate(
        req.user._id,
        { avatar: req.file.filename}, {new: true}
    )    
    return res.status(200).json({
        success: true,
        message: "Avatar uploaded successfully",
        data: updateUser
    })
    
}

exports.refreshToken = async (req,res) => {
    const { refreshToken } = req.cookies
    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: "Refresh token not found",
            data: null
        })
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        )
        

        const refreshTokens = await refreshTokenModel.find({
            user: decoded.id
        })
        

        let refreshTokenRecord = null

        for (const token of refreshTokens) {

            const isMatch = await bcrypt.compare(
                refreshToken,
                token.tokenHash
            )

            if (isMatch) {
                refreshTokenRecord = token
                break
            }
        }
        
        if (!refreshTokenRecord) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token",
                data: null
            })
        }

        if (refreshTokenRecord.revokedAt) {
            return res.status(401).json({
                success: false,
                message: "Refresh token has been revoked",
                data: null
            })
        }

        if (refreshTokenRecord.expiresAt < new Date()) {
            return res.status(401).json({
                success: false,
                message: "Refresh token has expired",
                data: null
            })
        }

        refreshTokenRecord.revokedAt = new Date()
        await refreshTokenRecord.save()

        const newRefreshToken = jwt.sign(
            {id:decoded.id},process.env.JWT_REFRESH_SECRET,{expiresIn: "30d"})

        const hashedRefreshToken = await bcrypt.hash(newRefreshToken,10)

        const expiresAt = new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
        )

        const savedHashedToken = await refreshTokenModel.create({
            tokenHash:hashedRefreshToken,
            user: decoded.id,
            expiresAt 
        })

        res.cookie("refreshToken",newRefreshToken,{
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000
        })

        const accessToken = jwt.sign(
            {id: decoded.id},process.env.JWT_SECRET,{expiresIn: "15m"}
        )

        return res.status(200).json({
            success: true,
            message: "Access token refreshed successfully",
            data: {accessToken}
        })

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired refresh token",
            data: null
        })
    }
}

exports.logout = async (req, res) => {
    const { refreshToken } = req.cookies

    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: "Refresh token not found !",
            data: null
        })
    }

    const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
    )

    const refreshTokens = await refreshTokenModel.find({
        user: decoded.id
    })

    let refreshTokenRecord = null

    for (const token of refreshTokens) {
        const isMatch = await bcrypt.compare(
            refreshToken,
            token.tokenHash
        )

        if (isMatch) {
            refreshTokenRecord = token
            break
        }
    }

    if (!refreshTokenRecord) {
        return res.status(401).json({
            success: false,
            message: "Invalid refresh token !",
            data: null
        })
    }

    refreshTokenRecord.revokedAt = new Date()

    await refreshTokenRecord.save()

    res.clearCookie("refreshToken")

    return res.status(200).json({
        success: true,
        message: "Logout successfully !",
        data: null
    })
}
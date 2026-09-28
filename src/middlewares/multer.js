const multer = require('multer')
const path = require('path')
const fs = require('fs')

const uploadDir = path.join(__dirname, "../uploads")
fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_")
        cb(null, Date.now() + "-" + safeName)
    }
})

const upload = multer({
    storage,
    fileFilter(req,file,cb){
        if(file.mimetype.startsWith("image/")){
            cb(null,true)
        }else{
            cb( new Error("Only images are allowed"))
        }
    },
    limits:{
        fileSize: 1024 * 1024 * 2
    }
})

module.exports = upload
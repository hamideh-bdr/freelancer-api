const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null,path.join(__dirname,"../uploads"))
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
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
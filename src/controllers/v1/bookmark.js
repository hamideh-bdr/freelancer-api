const bookMarkModel = require('../../models/bookMark')
const projectModel = require('../../models/project')

exports.add = async (req,res) => {
    const {projectId} = req.params 

    const project = await projectModel.findById(projectId) 
    if(!project){
        return res.status(404).json({
            success: false,
            message: "Project Not Found !",
            data: null
        })
    }

    const isExist = await bookMarkModel.findOne({
        project: project._id,
        user: req.user._id
    })
    if(isExist){
        return res.status(409).json({
            success: false,
            message: "Project already bookmarked!",
            data: null
        })
    }

    const bookmark = await bookMarkModel.create({
        project: project._id,
        user: req.user._id
    })

    return res.status(201).json({
        success: true,
        message: "Project Added Successfully !",
        data: bookmark
    })

}

exports.remove = async (req,res) => {
    const {bookmarkId} = req.params

    const isExist = await bookMarkModel.findById(bookmarkId)
    if(!isExist){
        return res.status(404).json({
            success: false,
            message: "Bookmark not found !",
            data: null
        })
    }

    if(String(isExist.user) === String (req.user._id)){
        await bookMarkModel.findByIdAndDelete(bookmarkId)
        return res.status(200).json({
        success: true,
        message: "Project removed successfully !",
        data: null
    })
    }
    return res.status(403).json({
        success: false,
        message: "you cant access to remove !",
        data: null
    })

}

exports.getOne = async(req ,res) => {
    const {bookmarkId} = req.params 
    const bookmark = await bookMarkModel.findById(bookmarkId).populate("project")
    if(!bookmark){
         return res.status(404).json({
            success: false,
            message: "Bookmark not found !",
            data: null
        })
    }
    
    if(String(bookmark.user) === String(req.user._id) ){
        return res.status(200).json({
            success: true,
            message: "Bookmark fetched successfully !",
            data: bookmark
        })
    }
    return res.status(403).json({
           success: false,
            message: "Access denied !",
            data: null
        })

}

exports.getAll = async(req ,res) => {
    const bookmarks = await bookMarkModel.find({user: req.user._id}).populate("project")
    if(bookmarks.length === 0){
        return res.status(404).json({
        success: false,
        message: "Bookmarks not found !",
        data: null
    })
    }
    return res.status(200).json({
        success: true,
        message: "Bookmarks fetched successfully !",
        data: bookmarks
    })
}
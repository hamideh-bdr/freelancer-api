const projectModel = require('../../models/project')
const userModel = require('../../models/user')
const valid = require('../../validator/project')
const {isValidObjectId} = require('mongoose')
const validator = require('../../validator/project');

exports.create = async(req ,res) => {
    const {title,
    description,
    budget,
    deliveryDays,
    category} = req.body

    const validate = valid(req.body)
    if(validate!== true){
        return res.status(422).json({
            success: false,
            message: "Request Is Not Valid !",
            data: validate})
    }

    const project = await projectModel.create({
    title,
    description,
    budget,
    deliveryDays,
    category,
    owner: req.user._id
    })

    return res.status(201).json({
        success: true,
        message: "Project Created Successfully!",
        data: project
    })


}

exports.getAll = async (req ,res) =>{
    const {search,status,category,page = 1,limit = 5} = req.query
    const pageNumber = Number(page)
    const limitNumber = Number(limit)
    const skipNumber = (pageNumber - 1) * limitNumber  
    const query = {}  

    if(search){
        query.$or = [
            {title:{$regex: search, $options: "i"}},
            {description:{$regex:search,$options:"i"}}
        ]
    }
    if(status){
        query.status = status
    }
    if(category){
        query.category = category
    }
    const projects = await projectModel
        .find(query)
        .skip(skipNumber)
        .limit(limitNumber)
    if(projects.length === 0 ){
        return res.status(404).json({
            success: false,
            message: " Project Not Found!",
            data:projects
        })
    }
    return res.status(200).json({
        success: true,
        message:"Projects Fetched Successfully!",
        data: projects
    })
}

exports.getOne = async (req ,res) =>{
    const {id} = req.params 
    const project = await projectModel.findById(id)

    if(!project){
        return res.status(404).json({
            success: false,
            message:"project not found!",
            data: null
        })

    }
    return res.status(200).json({
        success: true,
        message: "Project Fetched Successfully!",
        data: project
    })
}

exports.remove = async (req ,res) =>{
    const {id} = req.params
    const removedProject = await projectModel.findByIdAndDelete(id)
    if(!removedProject){
        return res.status(404).json({
            success: false,
            message:"project not found",
            data: null
        })
    }

    return res.status(200).json({
        success: true,
        message:"project removed Succesfully!",
        data: removedProject
    })

}

exports.update = async (req,res) => {
    const {id} = req.params
    const updatedProject = await projectModel.findByIdAndUpdate(id,req.body)
    if(!updatedProject){
        return res.status(404).json({
            success: false,
            message:"Project Not Found",
            data: null
        })
    }

    return res.status(200).json({
        success: true,
        message: "Project Updates Successfully !",
        data: updatedProject
    })
}

exports.getMy = async(req,res) => {
    const projects = await projectModel.find({owner:req.user._id})
    if(projects.length === 0){
        return res.status(404).json({
            success: false,
            message: "Projects Not Found!",
            data: null
        })
    }
     return res.status(200).json({
        success: true,
        message: "Projects Fetched Successfully !",
        data: projects})
}
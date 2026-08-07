const projectModel = require('../../models/project')
const userModel = require('../../models/user')
const valid = require('../../validators/project')
const {isValidObjectId} = require('mongoose')
const validator = require('../../validators/project');

exports.create = async(req ,res) => {
    const {title,
    description,
    budget,
    deliveryDays,
    category,
    images
} = req.body

    const validate = valid(req.body)
    if(validate!== true){
        return res.status(422).json({
            success: false,
            message: "Request Is Not Valid !",
            data: validate})
    }
    const image = req.files.map(file => file.filename)

    const project = await projectModel.create({
    title,
    description,
    budget,
    deliveryDays,
    category,
    owner: req.user._id,
    images: image
    })

    return res.status(201).json({
        success: true,
        message: "Project Created Successfully!",
        data: project
    })


}

exports.getAll = async (req ,res) =>{
    const {search,sort,status,category,page = 1,limit = 5} = req.query
    const pageNumber = Number(page)
    const limitNumber = Number(limit)
    const skipNumber = (pageNumber - 1) * limitNumber  
    const sortOption = {}
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
    if(sort === "newest"){
        sortOption.createdAt = -1
    }
    if(sort === "oldest"){
        sortOption.createdAt = 1
    }
    if(sort === "budget-low"){
        sortOption.budget = 1
    }
    if(sort === "budget-high"){
        sortOption.budget = -1
    }


    const projects = await projectModel
        .find(query)
        .sort(sortOption)
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

    const project = await projectModel.findById(id)
    if(!project){
        return res.status(404).json({
            success: false,
            message:"Project Not Found",
            data: null
        })
    }
    if(String(project.owner) === String(req.user._id)){
        const removedProject = await projectModel.findByIdAndDelete(id)
        return res.status(200).json({
            success: true,
            message:"project removed Succesfully!",
            data: null
        })
    }
    return res.status(409).json({
        success: false,
        message:"you cant removed project!",
        data: null
    })

    

}

exports.update = async (req,res) => {
    const {id} = req.params

    const project = await projectModel.findById(id)
    if(!project){
        return res.status(404).json({
            success: false,
            message:"Project Not Found",
            data: null
        })
        }
    if(String(project.owner) === String(req.user._id)){
        const updatedProject = await projectModel.findByIdAndUpdate(id,req.body,{returnDocument:'after'})
        return res.status(200).json({
            success: true,
            message: "Project Updated Successfully !",
            data: updatedProject
        })
    }
    return res.status(404).json({
        success: false,
        message:"you cant update project",
        data: null
    })

}

exports.getMy = async(req,res) => {
    const projects = await projectModel.find({owner:req.user._id})
    if(projects.length === 0){
        return res.status(404).json({
            success: false,
            message: "There is no projects!",
            data: null
        })
    }
     return res.status(200).json({
        success: true,
        message: "Projects Fetched Successfully !",
        data: projects})
}
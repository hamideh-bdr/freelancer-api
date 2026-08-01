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
        return res.status(422).json(validate)
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
        message: "Project Created Successfully!",
        data: project
    })


}

exports.getAll = async (req ,res) =>{
    const {search,status,category,page,limit} = req.query
    const pageNumber = page || 1
    const limitNumber = limit || 5
    const skipNumber = (pageNumber - 1) * limitNumber    

    if(search){
        const searchedProjects = await projectModel.find({$or:[
            {title:{$regex:search,$options:"i"}},
            {description:{$regex:search,$options:"i"}}]})
            .skip(skipNumber)
            .limit(limitNumber)
        if(searchedProjects.length === 0 ){
            return res.status(200).json({message: "No Progect Found!",
                data:searchedProjects
            })
        }
        return res.status(200).json(searchedProjects)
    }
    if(status){
        const statusProjects = await projectModel.find({status:{$regex:status,$options:"i"}})
        .skip(skipNumber).limit(limitNumber)
        if(statusProjects.length === 0 ){
            return res.status(200).json({message: "No Progect Found!",
                data:statusProjects
            })
        }
        return res.status(200).json(statusProjects)
    }
    if(category){
        const categoryProjects = await projectModel.find({category:{$regex:category,$options:"i"}})
        .skip(skipNumber).limit(limitNumber)
        if(categoryProjects.length === 0 ){
            return res.status(200).json({message: "No Progect Found!",
                data:categoryProjects
            })
        }
        return res.status(200).json(categoryProjects)
    }
    const projects = await projectModel.find().skip(skipNumber).limit(limitNumber)
    return res.status(200).json({
        message:"Projects Fetched Successfully!",
        data: projects
    })
}

exports.getOne = async (req ,res) =>{
    const {id} = req.params 
    const isValidId = isValidObjectId(id)
    if(!isValidId){
        return res.status(422).json({
            message: "Objectid is not Valid!"
        })
    }

    const project = await projectModel.findById(id)

    if(!project){
        return res.status(404).json({
            message:"project not found!"
        })

    }
    return res.status(200).json({
        message: "Projects Fetched Successfully!",
        data: project
    })
}

exports.remove = async (req ,res) =>{
    const {id} = req.params
    const isValidId = isValidObjectId(id)
    if(!isValidId){
    return res.status(422).json({
        message: "Objectid is not Valid!"
    })
    }

    const removedProject = await projectModel.findByIdAndDelete(id)
    if(!removedProject){
        return res.status(404).json({
            message:"project not found"
        })
    }

    return res.status(200).json({
        message:"project removed Succesfully!"
    })

}

exports.update = async (req,res) => {
    const {id} = req.params
     const isValidId = isValidObjectId(id)
    if(!isValidId){
    return res.status(422).json({
        message: "Objectid is not Valid!"
    })
    }

    const updatedProject = await projectModel.findByIdAndUpdate(id,req.body)
    if(!updatedProject){
        return res.status(404).json({
            message:"project not found"
        })
    }

    return res.status(200).json(updatedProject)
}

exports.getMy = async(req,res) => {
    const projects = await projectModel.find({owner:req.user._id})
    if(projects.length === 0){
        return res.status(404).json({message: "Projects Not Found!"})
    }
     return res.status(200).json({projects})
}
const proposalModel = require('../../models/proposal')
const projectModel = require('../../models/project')
const validatorCreate = require('../../validators/proposalCreate')
const validatorUpdate = require('../../validators/proposalUpdate')
const {isValidObjectId} = require('mongoose')

exports.create = async(req,res) => {
    const {projectId} = req.params 
    const {budget,message} = req.body
    const isValid = validatorCreate(req.body)
    if(isValid!== true){
        return res.status(422).json({
            success:false,
            message:"Request Is Not Valid!",
            data: isValid
        })
    }
    
    const project = await projectModel.findById(projectId) 
    if(!project){
        return res.status(404).json({
            success: false,
            message:"Project Not Found!",
            data: null
        })
    }
    if(project.status === "IN_PROGRESS" || project.status === "COMPLETED" ){
        return res.status(409).json({
            success: false,
            message:"Project Closed Already",
            data:null
        })
    }

    const isExist = await proposalModel.findOne({
        $and:[{user:req.user._id},{project:project.id}]
    })
    if(isExist){
        return res.status(409).json({
            success: false,
            message: "you have proposal already",
            data:null
        })

    }

    const proposal = await proposalModel.create({
        budget,
        message,
        user:req.user._id,
        project :project._id
    })
    return res.status(201).json({
        success: true,
        message: 'Proposal Created Successfully!!',
        data: proposal
    })

}

exports.getAll = async(req,res) => {
    const {projectId} = req.params
   
    const project = await projectModel.findById(projectId)
    if(!project){
        return res.status(404).json({
            success: false,
            message: "Project Not Fount!",
            data: null
        })
    }
    if(String(project.owner) === String(req.user._id)){
        
        const proposals = await proposalModel.find({project:projectId}).populate("user" ,"-password")

        if(proposals.length === 0){
            return res.status(404).json({
                success: false,
                message: "There Is No Proposals For Your Project!",
                data: null
            })
        }
        return res.status(200).json({
            success: true,
            message: "Proposals Fetched Successfull!",
            data: proposals})
    }
    return res.status(403).json({
        success: false,
        message: "You Are Not Owner Of This Project!",
        data: null
    })
}

exports.getAllProposals = async(req,res) => {
    const proposals = await proposalModel.find({
        user: req.user._id
    }).populate("project","title budjet status")

    if(proposals.length === 0){
        return res.status(404).json({
            success: false,
            message:"There Is No Proposal!",
            data: []
        })
    }
    return res.status(200).json({ 
        success: true,
        message: "Proposals Fetched Successfully!",
        data: proposals
    })
}

exports.update = async(req,res) => {
    const {proposalId} = req.params
    const{budget,message} = req.body 
    const isValid = validatorUpdate(req.body)
    if(isValid!== true){
        return res.status(422).json({
            success: false,
            message:"request is not valid!",
            data: isValid
        })
    }

    const proposal = await proposalModel.findById(proposalId)
    if(!proposal){
        return res.status(404).json({
            success: false,
            message: "Proposal Not Found!",
            data: null
        })
    }
    
    if(String(proposal.user) !== String(req.user._id)){
        return res.status(403).json({
            success: false,
            message: " You Cant Access Of This Proposal!",
            data:null
        })
    }

    const updatedProposal = await proposalModel.findOneAndUpdate({_id:proposalId} ,req.body)
    if(!updatedProposal){
        return res.status(404).json({
            success: false,
            message: "Proposal Is Not There!",
            data: null
        })
    }
    return res.status(200).json({
        success: true,
        message: "Proposal Updated Successfully!",
        data: updatedProposal
    })


}

exports.remove = async(req,res) => {
    const {proposalId} = req.params

    const proposal = await proposalModel.findById(proposalId)
    if(!proposal){
        return res.status(404).json({
            success: false,
            message: "The Proposal Not Found!",
            data: null
        })
    }
    if(String(req.user._id) !== String(proposal.user)){
        return res.status(400).json({
            success: false,
            message: "You Can`t Access ",
            data: null
        })
    }
    const removedProposal = await proposalModel.findByIdAndDelete(proposalId)
     return res.status(200).json({
        success: true,
        message: "Proposal Removed Successfully!",
        data: removedProposal
    })    
}

exports.accept = async(req,res) => {
    const {proposalId} = req.params    
    const {status} = req.body
    const isValid = validatorUpdate(req.body)
    if(isValid!== true){
        return res.status(422).json({
            success: false,
            message:"request is not valid!",
            data: isValid})
    }

    const proposal = await proposalModel.findById(proposalId); 
     if(!proposal){
        return res.status(404).json({
            success: false,
            message: "The Proposal Not Found!",
            data: null
        })
    } 
    const project = await projectModel.findOne(proposal.project)
    
    if(String(project.owner) === String(req.user._id)){ 
        const acceptedProposal = await proposalModel.findOne({
            project: proposal.project,
            status:"ACCEPTED"}) 
        
        if(acceptedProposal && req.body.status === "ACCEPTED" ){
            return res.status(409).json({
                success: false,
                message:"There Is Accepted Proposal!",
                data: null
            })
        }

        const updatedProposal = await proposalModel.findByIdAndUpdate(
            proposalId,req.body,{returnDocument : 'after'})        
        if(req.body.status === "ACCEPTED"){ //
            await projectModel.findOneAndUpdate(
                updatedProposal.project,{status:"IN_PROGRESS"})
            }
        return res.status(200).json({
            success: true,
            message: "Proposal Updated Successfully !",
            data: updatedProposal})
    }
    return res.status(403).json({
        success: false,
        message: "you cant access to update !",
        data: null
    })
}
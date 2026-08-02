const proposalModel = require('../../models/proposal')
const projectModel = require('../../models/project')
const validatorCreate = require('../../validator/proposalCreate')
const validatorUpdate = require('../../validator/proposalUpdate')
const {isValidObjectId} = require('mongoose')

exports.create = async(req,res) => {
    const {projectId} = req.params 
    const {budget,message} = req.body
    const isValid = validatorCreate(req.body)
    if(isValid!== true){
        return res.status(422).json({
            message:"request is not valid!",
            data: isValid
        })
    }
    
    const project = await projectModel.findById(projectId) 
    if(!project){
        return res.status(404).json({
            message:"Project Not Found!"
        })
    }
    if(project.status === "IN_PROGRESS" || project.status === "COMPLETED" ){
        return res.status(409).json({message:"project closed already"})
    }

    const isExist = await proposalModel.findOne({
        $and:[{user:req.user._id},{project:project.id}]
    })
    if(isExist){
        return res.status(409).json({
            message: "you have proposal already"
        })

    }

    const proposal = await proposalModel.create({
        budget,
        message,
        user:req.user._id,
        project :project._id
    })
    return res.status(201).json({
        message: 'Proposal Created Successfully!!',
        data: proposal
    })

}

exports.getAll = async(req,res) => {
    const {projectId} = req.params
   
    const project = await projectModel.findById(projectId)
    if(String(project.owner) === String(req.user._id)){
        
        const proposals = await proposalModel.find({project:projectId}).populate("user" ,"-password")

        if(proposals.length === 0){
            return res.status(404).json({
            mess: "There Is No Proposals For Your Project!"})
        }
        return res.status(200).json({proposals})
    }
    return res.status(403).json({
        message: "You Are Not Owner Of This Project!"})
}

exports.getAllProposals = async(req,res) => {
    const proposals = await proposalModel.find({
        user: req.user._id
    }).populate("project","title budjet status")

    if(proposals.length === 0){
        return res.status(404).json({
            message:"There Is No Proposal!",
            data: proposals
        })
    }
    return res.status(200).json(proposals)
}

exports.update = async(req,res) => {
    const {proposalId} = req.params
    const{budget,message} = req.body 
    const isValid = validatorUpdate(req.body)
    if(isValid!== true){
        return res.status(422).json({
            message:"request is not valid!",
            data: isValid
        })
    }

    const proposal = await proposalModel.findById(proposalId)
    
    if(String(proposal.user) !== String(req.user._id)){
        return res.status(403).json({message: " You Cant Access Of This Proposal!"})
    }

    const updatedProposal = await proposalModel.findOneAndUpdate({_id:proposalId} ,req.body)
    if(!updatedProposal){
        return res.status(404).json({message: "Proposal Is Not There!"})
    }
    return res.status(200).json({updatedProposal})


}

exports.remove = async(req,res) => {
    const {proposalId} = req.params

    const proposal = await proposalModel.findById(proposalId)
    if(!proposal){
        return res.status(404).json({
            message: "The Proposal Not Found!"})
    }
    if(String(req.user._id) !== String(proposal.user)){
        return res.status(400).json({message: "You Can`t Access "})
    }
    const removedProposal = await proposalModel.findByIdAndDelete(proposalId)
     return res.status(200).json({message: "Proposal Removed Successfully!"})    
}

exports.accept = async(req,res) => {
    const {proposalId} = req.params    
    const {status} = req.body
    const isValid = validatorUpdate(req.body)
    if(isValid!== true){
        return res.status(422).json({
            message:"request is not valid!",
            data: isValid})
    }

    const proposal = await proposalModel.findById(proposalId); 
     if(!proposal){
        return res.status(404).json({
            message: "The Proposal Not Found!"})
    } 
    const project = await projectModel.findOne(proposal.project)
    
    if(String(project.owner) === String(req.user._id)){ 
        const acceptedProposal = await proposalModel.findOne({
            project: proposal.project,
            status:"ACCEPTED"}) 
        
        if(acceptedProposal && req.body.status === "ACCEPTED" ){
            return res.status(409).json({
                message:"There Is Accepted Proposal!"})
        }

        const updatedProposal = await proposalModel.findByIdAndUpdate(proposalId,req.body,{returnDocument : 'after'})        
        if(req.body.status === "ACCEPTED"){ //
            await projectModel.findOneAndUpdate(
                updatedProposal.project,{status:"IN_PROGRESS"})
            }
        return res.status(200).json(updatedProposal)
    }
    return res.status(403).json({message: "you cant access to update !"})
    
    

}
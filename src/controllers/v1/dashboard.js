const projectModel = require('../../models/project')
const proposalModel = require('../../models/proposal')

exports.stats = async(req ,res) => {
    const projects = await projectModel.find({owner:req.user._id}).select("_id")
    if(projects.length === 0){
        return res.status(404).json({message: "There Is No Project!"})
    }
    const projectsCount = await projectModel.countDocuments({owner:req.user._id})
    const openProjects = await projectModel.countDocuments({owner:req.user._id,status:"OPEN"})
    const inProgressProjects = await projectModel.countDocuments({owner:req.user._id,status:"IN_PROGRESS"})
    const completedProjects = await projectModel.countDocuments({owner:req.user._id,status:"COMPLETED"})
    const totalProposals = await proposalModel.countDocuments({project:{$in:projects}})
    const acceptedProposals = await proposalModel.countDocuments({project:{$in:projects},status:"ACCEPTED"})
    return res.status(200).json({
        projectsCount,
        openProjects,
        inProgressProjects,
        completedProjects,
        totalProposals,
        acceptedProposals
})
        
}
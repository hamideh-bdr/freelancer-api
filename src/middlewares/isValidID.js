const {isValidObjectId} = require('mongoose')

module.exports= (req ,res, next) => {
    const {id,proposalId,projectId} = req.params
    const objectId = id || proposalId || projectId

    const isValidId = isValidObjectId(objectId)
    console.log(isValidId);
    
    if(!isValidId){
        return res.status(422).json({message: "Id is Not Valid !!"}) 
    }
    next()
}
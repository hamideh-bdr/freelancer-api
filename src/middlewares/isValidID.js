const {isValidObjectId} = require('mongoose')

module.exports= (req ,res, next) => {
    const {id,proposalId,projectId} = req.params
    const objectId = id || proposalId || projectId

    const isValidId = isValidObjectId(objectId)
    
    if(!isValidId){
        return res.status(422).json({
            success: false,
            message: "Id is Not Valid !!",
            data: null
        }) 
    }
    next()
}
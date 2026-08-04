const {isValidObjectId} = require('mongoose')

module.exports= (req ,res, next) => {
    const {id,proposalId,projectId, bookmarkId} = req.params
    const objectId = id || proposalId || projectId || bookmarkId

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
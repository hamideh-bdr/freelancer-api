const express = require('express')
const authMiddleware = require('../../middlewares/authMiddleware')
const isValidIdMiddleware = require('../../middlewares/isValidID')
const proposalController = require('../../controllers/v1/proposal')
const router = express.Router()

router.route('/:proposalId/accept')
    .patch(authMiddleware,isValidIdMiddleware,proposalController.accept)

router.route('/:proposalId')
    .patch(authMiddleware,isValidIdMiddleware,proposalController.update)
    .delete(authMiddleware,isValidIdMiddleware,proposalController.remove)

router.route('/:projectId')
    .post(authMiddleware,isValidIdMiddleware,proposalController.create)
    .get(authMiddleware,isValidIdMiddleware,proposalController.getAll)
    
router.route('/')
    .get(authMiddleware,proposalController.getAllProposals)



module.exports = router
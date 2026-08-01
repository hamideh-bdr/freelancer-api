const express = require('express')
const authMiddleware = require('../../middlewares/authMiddleware')
const proposalController = require('../../controllers/v1/proposal')
const router = express.Router()


router.route('/:proposalId/accept')
    .patch(authMiddleware,proposalController.accept)

router.route('/:proposalId')
    .patch(authMiddleware,proposalController.update)
    .delete(authMiddleware,proposalController.remove)

router.route('/:projectId')
    .post(authMiddleware,proposalController.create)
    .get(authMiddleware,proposalController.getAll)
    
router.route('/')
    .get(authMiddleware,proposalController.getAllProposals)



module.exports = router
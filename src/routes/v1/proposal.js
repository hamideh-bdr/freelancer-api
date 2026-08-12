const express = require('express')
const authMiddleware = require('../../middlewares/authMiddleware')
const isValidIdMiddleware = require('../../middlewares/isValidID')
const {generalLimit} = require('../../middlewares/rateLimiter')
const proposalController = require('../../controllers/v1/proposal')
const router = express.Router()
router.use(generalLimit)

/**
 * @swagger
 * /proposals/{proposalId}:
 *   patch:
 *     summary: Update proposal
 *     tags:
 *       - Proposals
 *     parameters:
 *       - in: path
 *         name: proposalId
 *         required: true
 *         schema:
 *           type: string
 *           example: 6a73af4d661c2a3a7484ddc4
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: I can do that
 *               budget:
 *                 type: number
 *                 example: 500000
 *     responses:
 *       200:
 *         description: Proposal updated successfully
 *       422:
 *         description: Validation failed
 *       404:
 *         description: Proposal not found
 *       403:
 *         description: Lack of access
 * 
 * 
 *   delete:
 *     summary: Delete proposal
 *     tags:
 *       - Proposals
 *     parameters:
 *       - in: path
 *         name: proposalId
 *         required: true
 *         schema:
 *           type: string
 *           example: 6a73af4d661c2a3a7484ddc4
 *     responses:
 *       200:
 *         description: Proposal removed successfully
 *       422:
 *         description: Validation failed
 *       404:
 *         description: Proposal not found
 *       400:
 *         description: Lack of access
 */
router.route('/:proposalId')
    .patch(authMiddleware,isValidIdMiddleware,proposalController.update)
    .delete(authMiddleware,isValidIdMiddleware,proposalController.remove)

/**
 * @swagger
 * /proposals/{proposalId}/accept:
 *   patch:
 *     summary: Accept proposal
 *     tags:
 *       - Proposals
 *     parameters:
 *       - in: path
 *         name: proposalId
 *         required: true
 *         schema:
 *           type: string
 *           example: 6a73af4d661c2a3a7484ddc4
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: ACCEPTED
 *     responses:
 *       200:
 *         description: Proposal updated successfully
 *       422:
 *         description: Validation failed
 *       404:
 *         description: Proposal not found
 *       403:
 *         description: Lack of access
 *       409:
 *         description: There is accept already
 */
router.route('/:proposalId/accept')
    .patch(authMiddleware,isValidIdMiddleware,proposalController.accept)

/**
 * @swagger
 * /proposals/{projectId}:
 *   post:
 *     summary: New proposal
 *     tags:
 *       - Proposals
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           example: 6a73af4d661c2a3a7484ddc4
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 example: I can do that
 *               budget:
 *                 type: number
 *                 example: 500000
 *     responses:
 *       201:
 *         description: Proposal created successfully
 *       422:
 *         description: Validation failed
 *       404:
 *         description: Not found
 *       409:
 *         description: Lack of access
 * 
 * 
 *   get:
 *     summary: Get project's proposal
 *     tags:
 *       - Proposals
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           example: 6a73af4d661c2a3a7484ddc4
 *     responses:
 *       200:
 *         description: Processes done successfully
 *       422:
 *         description: Validation failed
 *       404:
 *         description: Not found
 *       403:
 *         description: Lack of access
 */
router.route('/:projectId')
    .post(authMiddleware,isValidIdMiddleware,proposalController.create)
    .get(authMiddleware,isValidIdMiddleware,proposalController.getAll)
    
/**
 * @swagger
 * /proposals:
 *   get:
 *     summary: Get your proposals
 *     tags:
 *       - Proposals
 *     responses:
 *       200:
 *         description: Processes done successfully
 *       404:
 *         description: Not found
 */
router.route('/')
    .get(authMiddleware,proposalController.getAllProposals)


module.exports = router
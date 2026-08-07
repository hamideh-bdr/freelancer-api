const express = require('express')
const router = express.Router()
const projectController = require('../../controllers/v1/project')
const authMiddleware = require('../../middlewares/authMiddleware')
const isValidIdMiddleware = require('../../middlewares/isValidID')
const upload = require('../../middlewares/multer')


router.route('/')
    .post(authMiddleware,upload.array("images",5),projectController.create)
    .get(projectController.getAll)

/**
 * @swagger
 * /projects/my:
 *   get:
 *     summary: Get Your projects
 *     tags:
 *       - Projects
 *     responses:
 *       200:
 *         description: Projects Fetched Successfully
 *       404:
 *         description: There is no projects
 */
router.route("/my")
    .get(authMiddleware,projectController.getMy)

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags:
 *       - Projects
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: srting
 *           example: 6b78f865d875jn976n6438n
 *     responses:
 *       200:
 *         description: Project fetched successfully
 *       422:
 *         description: Validation failed
 *       404:
 *         description: Project not found
 * 
 * 
 *   delete:
 *     summary: Delete your project
 *     tags:
 *       - Projects
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: srting
 *           example: 6b78f865d875jn976n6438n
 *     responses:
 *       200:
 *         description: Project removed successfully
 *       422:
 *         description: Validation failed
 *       404:
 *         description: Project not found
 *       409:
 *         description: You cant removed project
 * 
 * 
 *   patch:
 *     summary: Update your project
 *     tags:
 *       - Projects
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: srting
 *           example: 6b78f865d875jn976n6438n
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Backend Developer
 *               description:
 *                 type: string
 *                 example: We need backend developer for ...
 *               budget:
 *                 type: number
 *                 example: 500000
 *               deliveryDays:
 *                 type: number
 *                 example: 51 
 *               category:
 *                 type: string
 *                 example: Backend
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       422:
 *         description: Validation failed
 *       404:
 *         description: Project not found
 *       409:
 *         description: You cant update project
 */
router.route('/:id')
    .get(isValidIdMiddleware,projectController.getOne)
    .delete(authMiddleware,isValidIdMiddleware,projectController.remove)
    .patch(authMiddleware,isValidIdMiddleware,projectController.update)


module.exports = router
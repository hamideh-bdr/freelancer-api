const express = require('express')
const router = express.Router()
const projectController = require('../../controllers/v1/project')
const authMiddleware = require('../../middlewares/authMiddleware')
const isValidIdMiddleware = require('../../middlewares/isValidID')
const {generalLimit} = require('../../middlewares/rateLimiter')
const upload = require('../../middlewares/multer')

router.use(generalLimit)

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project
 *     tags:
 *       - Projects
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: Build a freelancer website
 *               description:
 *                 type: string
 *                 example: I need a backend developer to build my website.
 *               budget:
 *                 type: number
 *                 example: 500
 *               category:
 *                 type: string
 *                 example: Web Development
 *               deliveryDays:
 *                 type: number
 *                 example: 51
 *
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: Build a freelancer website
 *               description:
 *                 type: string
 *                 example: I need a backend developer to build my website.
 *               budget:
 *                 type: number
 *                 example: 500
 *               category:
 *                 type: string
 *                 example: Web Development
 *               deliveryDays:
 *                 type: number
 *                 example: 51
 * 
 *               images:
 *                 type: array
 *                 maxItems: 5
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Project created successfully
 *       422:
 *         description: Validation failed
 *
 * 
 *   get:
 *     summary: Get all projects
 *     tags:
 *       - Projects
 *
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Search in project title and description
 *         example: website
 *
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - OPEN
 *             - IN_PROGRESS
 *             - COMPLETED
 *         description: Filter projects by status
 *         example: OPEN
 *
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter projects by category
 *         example: Web
 *
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number
 *         example: 1
 *
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 5
 *           minimum: 1
 *         description: Number of projects per page
 *         example: 5
 *
 *       - in: query
 *         name: sort
 *         required: false
 *         schema:
 *           type: string
 *         description: Sort projects
 *         example: newest
 *
 *     responses:
 *       200:
 *         description: Projects fetched successfully
 *
 *       404:
 *         description: No projects found
 *
 *       500:
 *         description: Internal server error
 */
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
const express = require('express')
const router = express.Router()
const bookMarkController = require('../../controllers/v1/bookmark')
const authMiddleware = require('../../middlewares/authMiddleware')
const isValidMiddleware = require('../../middlewares/isValidID')
const {generalLimit} = require('../../middlewares/rateLimiter')

router.use(generalLimit)

/**
 * @swagger
 * /bookmarks/{bookmarkId}:
 *   delete:
 *     summary: Remove bookmark
 *     tags:
 *       - Bookmarks
 *     parameters:
 *       - in: path
 *         name: bookmarkId
 *         required: true
 *         schema:
 *           type: srting
 *           example: 6b78f865d875jn976n6438n
 *     responses:
 *       200:
 *         description: Bookmark removed successfully
 *       422:
 *         description: Validation failed
 *       404:
 *         description: Bookmark not found
 *       403:
 *         description: Access denied
 * 
 * 
 *   get:
 *     summary: Get bookmark by ID
 *     tags:
 *       - Bookmarks
 *     parameters:
 *       - in: path
 *         name: bookmarkId
 *         required: true
 *         schema:
 *           type: srting
 *           example: 6b78f865d875jn976n6438n
 *     responses:
 *       200:
 *         description: Bookmark fetched successfully
 *       422:
 *         description: Validation failed
 *       404:
 *         description: Bookmark not found
 *       403:
 *         description: Access denied
 */
router.route('/:bookmarkId/')
    .delete(authMiddleware,isValidMiddleware,bookMarkController.remove)
    .get(authMiddleware,isValidMiddleware,bookMarkController.getOne)

/**
 * @swagger
 * /bookmarks/add/{projectId}:
 *   post:
 *     summary: Add new bookmark
 *     tags:
 *       - Bookmarks
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: srting
 *           example: 6b78f865d875jn976n6438n
 *     responses:
 *       201:
 *         description: Project bookmarked successfully
 *       422:
 *         description: Validation failed
 *       409:
 *         description: Project already bookmarked
 *       404:
 *         description: Project not found
 */
router.route('/add/:projectId')
    .post(authMiddleware,isValidMiddleware,bookMarkController.add)
    
/**
 * @swagger
 * /bookmarks:
 *   get:
 *     summary: Get your bookmarks
 *     tags:
 *       - Bookmarks
 *     responses:
 *       200:
 *         description: Bookmarks fetched successfully
 *       404:
 *         description: Bookmarks not found
 */
router.route('/')
    .get(authMiddleware,bookMarkController.getAll)

module.exports = router
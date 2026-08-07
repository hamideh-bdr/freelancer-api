const express = require('express')
const router = express.Router()
const dashboardController = require('../../controllers/v1/dashboard')
const authMiddleware = require('../../middlewares/authMiddleware')

/**
 * @swagger
 * /dashboards:
 *   get:
 *     summary: Get your dashboars
 *     tags:
 *       - Statistics
 *     responses:
 *       200:
 *         description: Dashboard Statistics Fetched Successfully
 *       404:
 *         description: Not found
 */
router.route('/')
    .get(authMiddleware,dashboardController.stats)

module.exports = router
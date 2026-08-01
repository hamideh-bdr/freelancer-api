const express = require('express')
const router = express.Router()
const dashboardController = require('../../controllers/v1/dashboard')
const authMiddleware = require('../../middlewares/authMiddleware')

router.route('/')
    .get(authMiddleware,dashboardController.stats)

module.exports = router
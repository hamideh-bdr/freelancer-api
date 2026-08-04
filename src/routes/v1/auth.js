const express = require('express')
const router = express.Router()
const authMiddleware = require('../../middlewares/authMiddleware')
const isAdminMiddleware = require('../../middlewares/isAdmin')
const authController = require('../../controllers/v1/auth')
const upload = require('../../middlewares/multer')

router.route('/register')
    .post(authController.register)

router.route('/login')
    .post(authController.login)

router.route('/me')
    .get(authMiddleware,authController.getMe)

router.route("/avatar")
    .patch(authMiddleware,upload.single("avatar"),authController.uploadAvatar)

module.exports = router
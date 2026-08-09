const express = require('express')
const router = express.Router()
const authMiddleware = require('../../middlewares/authMiddleware')
const authController = require('../../controllers/v1/auth')
const upload = require('../../middlewares/multer')

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - username
 *               - email
 *               - password
 *               - phone
 *             properties:
 *               username:
 *                 type: string
 *                 example: Mahroo123
 *               email:
 *                 type: string
 *                 example: mahroo@gmail.com
 *               password:
 *                 type: string
 *                 example: 6687436mah
 *               name: 
 *                 type: string
 *                 example: Mahroo
 *               phone:
 *                 type: string
 *                 example: 09121234567
 *     responses:
 *       201:
 *         description: User created successfully
 *       422:
 *         description: Validation failed
 *       409:
 *         description: Username or email already exists
 */
router.route('/register')
    .post(authController.register)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identifier
 *               - password
 *             properties:
 *               identifier:
 *                 type: string
 *                 example: Mahroo123 / mahroo@gmail.com
 *               password:
 *                 type: string
 *                 example: 6687436mah
 *     responses:
 *       200:
 *         description: User login successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Invalid email or password
 */
router.route('/login')
    .post(authController.login)

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Getting information
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: User fetched successfully
 */
router.route('/me')
    .get(authMiddleware,authController.getMe)

/**
 * @swagger
 * /auth/avatar:
 *   patch:
 *     summary: Upload user avatar
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/from-data:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 example: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 */
router.route("/avatar")
    .patch(authMiddleware,upload.single("avatar"),authController.uploadAvatar)

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *       401:
 *         description: Invalid, expired, revoked, or missing refresh token
 */
router.route("/refresh-token")
    .post(authController.refreshToken)


module.exports = router
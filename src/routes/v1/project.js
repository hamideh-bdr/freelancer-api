const express = require('express')
const router = express.Router()
const projectController = require('../../controllers/v1/project')
const authMiddleware = require('../../middlewares/authMiddleware')
const isAdminMiddleware = require('../../middlewares/isAdmin')

router.route('/')
    .post(authMiddleware,projectController.create)
    .get(projectController.getAll)

router.route("/my")
    .get(authMiddleware,projectController.getMy)

router.route('/:id')
    .get(projectController.getOne)
    .delete(authMiddleware,isAdminMiddleware,projectController.remove)
    .patch(authMiddleware,isAdminMiddleware,projectController.update)


module.exports = router
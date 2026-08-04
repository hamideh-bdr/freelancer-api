const express = require('express')
const router = express.Router()
const projectController = require('../../controllers/v1/project')
const authMiddleware = require('../../middlewares/authMiddleware')
const isAdminMiddleware = require('../../middlewares/isAdmin')
const isValidIdMiddleware = require('../../middlewares/isValidID')
const upload = require('../../middlewares/multer')

router.route('/')
    .post(authMiddleware,upload.array("images",5),projectController.create)
    .get(projectController.getAll)

router.route("/my")
    .get(authMiddleware,projectController.getMy)

router.route('/:id')
    .get(isValidIdMiddleware,projectController.getOne)
    .delete(authMiddleware,isAdminMiddleware,isValidIdMiddleware,projectController.remove)
    .patch(authMiddleware,isAdminMiddleware,isValidIdMiddleware,projectController.update)


module.exports = router
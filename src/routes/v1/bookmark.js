const express = require('express')
const router = express.Router()
const bookMarkController = require('../../controllers/v1/bookmark')
const authMiddleware = require('../../middlewares/authMiddleware')
const isValidMiddleware = require('../../middlewares/isValidID')

router.route('/:bookmarkId/')
    .delete(authMiddleware,isValidMiddleware,bookMarkController.remove)
    .get(authMiddleware,isValidMiddleware,bookMarkController.getOne)

router.route('/add/:projectId')
    .post(authMiddleware,isValidMiddleware,bookMarkController.add)
    
router.route('/')
    .get(authMiddleware,bookMarkController.getAll)

module.exports = router
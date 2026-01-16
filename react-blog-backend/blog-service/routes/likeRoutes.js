const express = require("express")
const {
    addLike,
    removeLike,
    getLikesByPost
} = require("../controllers/likeController")
const { protect } = require("../middleware/authMiddleware") 
const logger = require("../blogLogs/logger");

const router = express.Router()

const loggerMiddleware = (req, res, next) => {
    logger.info(`${req.method} ${req.url} - Request Received`)
    next()
}

router.post("/:id", protect, addLike)
router.delete("/:id", protect, removeLike)
router.get("/:id", protect, getLikesByPost)

module.exports = router
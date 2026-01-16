const express = require("express");
const {
    fetchComments,
    fetchSingleComment,
    addComment,
    editComment,
    deleteComment
} = require("../controllers/commentsController");
const { protect } = require("../middleware/authMiddleware");
const logger = require("../blogLogs/logger");

const router = express.Router();

const loggerMiddleware = (req, res, next) => {
    logger.info(`${req.method} ${req.url} - Request Received`)
    next()
}

router.use(loggerMiddleware)

router.get("/:id", protect, fetchComments)
router.post("/:id", protect, addComment)
router.put("/:id", protect, editComment)
router.delete("/:id", protect, deleteComment)

module.exports = router
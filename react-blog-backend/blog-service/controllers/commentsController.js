const Post = require("../models/Posts");
const Comment = require("../models/Comments");

exports.fetchComments = async (req, res) => {
    try {
        const comments = await Comment.find({post: req.params.id})
            .populate("content author")
        return res.json(comments)
    } catch (error) {
        console.error("Error fetching comments:", error)
        res.status(500).json({ message: "Failed to fetch comments", error: error.message})
    }
}

exports.fetchSingleComment = async (req, res) => {
    try {
        const comment = await Comment.findById({_id: req.params.id})
            .populate("name email")
        if (!comment) {
            return res.status(404).json({ message: "No comment exists with the chosen ID."})
        }
        return res.json(comment)
    } catch (error) {
        console.error("Error fetching comment:", error)
        res.status(500).json({ message: "Failed to fetch comment", error: error.message})
    }
}

exports.addComment = async (req, res) => {
    try {
        const { content } = req.body
        const post = await Post.findById(req.params.id)
        
        const comment = new Comment({
            content: content,
            author: req.user.id,
            post: req.params.id
        })
        await comment.save()
        post.comments.push(comment._id)
        await post.save()
        return res.status(200).json(comment)
    } catch (error) {
        console.error("Error adding comment:", error)
        res.status(500).json({ message: "Failed to add comment", error: error.message})
    }
}

exports.editComment = async (req, res) => {
    try {
        let comment = await Comment.findById(req.params.id) 
        if (!comment) {
            console.error(`No such comment: ${req.params.id}`)
            return res.status(404).json({ message: "No comment exists with the chosen ID."})
        }
        if (req.user.id != comment.author) {
            return res.status(403).json({ message: "User is not author"});
        } else {
            comment.content = req.body.content
            await comment.save()
            return res.status(200).json(comment)
        }
    } catch (error) {
        console.error("Error editing comment:", error)
        res.status(500).json({ message: "Failed to edit comment", error: error.message})
    }
}

exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id)
        if (!comment) {
            return res.status(404).json({ message: "No comment exists with the chosen ID."})
        }
        if (req.user.id != comment.author) {
            return res.status(403).json({ message: "User is not author"});
        } else {
            await comment.deleteOne()
            Post.updateOne({$pull: { comments: req.params.id }})
            return res.status(200).json({message: "Comment deleted"})
        }
    } catch (error) {
        console.error("Error deleting comment:", error)
        res.status(500).json({ message: "Failed to delete comment", error: error.message})
    }

}
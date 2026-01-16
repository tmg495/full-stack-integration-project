const Like = require("../models/Like")
const Post = require("../models/Posts")

exports.addLike = async (req, res) => {
      try {
            const post = await Post.findById(req.params.id)
            if (!post) {
                  console.error("404 - No such post exists.")
                  return res.status(404).json({message: "No such post exists."})
            }
            const hasLiked = await Like.findOne({
                  user: req.user.id,
                  post: req.params.id
            })
            if (hasLiked) {
                  console.error("400 - Post already liked.")
                  return res.status(400).json({message: "Post already liked."})
            }
            const newLike = new Like({
                  user: req.user.id,
                  post: req.params.id
            })
            await newLike.save()
            post.likes.push(newLike._id)
            await post.save()
            return res.status(201).json({message: "You liked the post.", newLike})
      } catch (error) {
            console.error(error)
            res.status(500).json({message: "Error processing like."})
      }
}

exports.removeLike = async (req, res) => {
      try {
            const like = await Like.findOne({
                  user: req.user.id,
                  post: req.params.id
            })
            if (!like) {
                  console.error("404 - No such like.")
                  return res.status(404).json({message: "No such like."})
            }
            if (like.user != req.user.id) {
                  console.error("403 - User not approved.")
                  return res.status(403).json({message: "User not approved."})
            }
            await Like.deleteOne({
                  user: req.user.id,
                  post: req.params.id
            })
            const post = await Post.findById(req.params.id)
            post.likes = post.likes.filter((k) => k._id != like._id)
            await post.save()
            return res.status(200).json({message: "Like removed."})
      } catch (error) {
            console.error(error)
            res.status(500).json({message: "Error removing like."})
      }
}

exports.getLikesByPost = async (req, res) => {
      try {
            const likes = await Like.find({post: req.params.id})
                  .populate("user")
            return res.status(200).json(likes)
      } catch (error) {
            console.error(error)
            res.status(500).json({message: "Error retrieving likes"})
      }
}
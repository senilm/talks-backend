import express from 'express'
import {getFeedPosts, getUserPosts, likePost,commentPost ,commentDelete,createPost} from "../controllers/post.js";
import authentication from '../middleware/authentication.js';
const router = express.Router()


router.route('/').get(getFeedPosts)
router.route('/').post(createPost)
router.get('/:userId/posts', getUserPosts)
router.patch("/:id/like", likePost)
router.patch("/:id/comment",  commentPost)
router.delete("/:id/comment/:commentId", commentDelete)

export default router
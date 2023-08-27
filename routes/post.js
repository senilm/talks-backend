import express from 'express'
import {getFeedPosts, getUserPosts, likePost } from "../controllers/post.js";
import authentication from '../middleware/authentication.js';
const router = express.Router()

// read
router.route('/').get(authentication,getFeedPosts)
router.get('/:userId/posts',authentication, getUserPosts)

// update
router.patch("/:id/like", authentication, likePost)

export default router
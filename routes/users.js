import express from 'express'


import {getUser, getUserFriends, updateUserFriends} from '../controllers/user.js'

const router = express.Router()
// read
router.route('/:id').get(getUser)
router.route('/:id/friends').get(getUserFriends)


// update
router.route('/:id/:friendId').patch(updateUserFriends)

export default router

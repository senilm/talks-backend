import Post from '../models/post.js'
import UserModel from '../models/user.js'
import cloudinary from "../utils/utils.js";

// Read Post
export const getFeedPosts = async(req,res)=>{
    try {
        const post = (await Post.find()).reverse();
        res.status(200).json(post)
    } catch (err) {
        res.status(404).json({ message: err.message });    
    }
    
}
export const getUserPosts = async(req,res)=>{
    try {
        const {userId} = req.params;
        
        const post = await (await Post.find({userId})).reverse()
        res.status(200).json(post)
    } catch (err) {
        res.status(404).json({ message: err.message });   
    }
    
}


export const likePost = async(req,res)=>{
    try {
        const {id} = req.params;
        const {userId} = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId)
        if(isLiked){
            post.likes.delete(userId);
        }
        else{
            post.likes.set(userId, true)
        }
        const updatedPost =await Post.findByIdAndUpdate(id, {likes:post.likes},{new:true})
        res.status(200).json(updatedPost);
    } catch (err) {    
        res.status(404).json({ message: err.message });
    }
}
export const commentPost = async(req,res)=>{
    try {
        const {id} = req.params;
        const {userId} = req.body;
        const {commentContent} = req.body
        const post = await Post.findById(id);
        const commentId =id + new Date().getTime()
        post.comments.push({commentContent,userId,commentId})
        const updatedPost =await Post.findByIdAndUpdate(id, {comments:post.comments},{new:true})
        res.status(200).json(updatedPost);
    } catch (err) {    
        res.status(404).json({ message: err.message });
    }
}
export const commentDelete = async(req,res)=>{
    try {
        const {id} = req.params;
        const {userId} = req.body;
        const {commentId} = req.params
        const post = await Post.findById(id);
        const newComments = post.comments.filter((comment)=>comment.commentId !== commentId)
        
        const updatedPost =await Post.findByIdAndUpdate(id, {comments:newComments},{new:true})

        res.status(200).json(updatedPost);
    } catch (err) {    
        res.status(404).json({ message: err.message });
    }
}



// Create Post
export const createPost = async (req,res)=>{
    try{
        const {userId, description} = req.body
        const file = req.files.postPicture;
        
        if (!file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        const result = await cloudinary.uploader.upload(file.tempFilePath);

        // if (!result) {
        //     return res.status(500).json({ error: 'Failed to upload file to Cloudinary' });
        // } if there will be any error in uploading then this will return from from won't go down so it will show error saying that posts.map is not a function
        
        const user = await UserModel.findById(userId);
        const newPost = await Post.create({
            userId,
            firstName:user.firstName,
            lastName:user.lastName,
            location:user.location,
            description,
            userPicture:user.picture.url,
            postPicture:{
                public_id:result.public_id,
                url:result.secure_url,
            },
            likes:{},
            comments:[]
        })
        

        const post = (await Post.find({})).reverse();
        res.status(201).json(post)
    }catch(err){
        res.status(409).json({ message: err.message });
    }
}
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        min:2,
        max:50
    },
    lastName:{
        type:String,
        required:true,
        min:2,
        max:50
    },
    email:{
        type:String,
        required:true,
        match:[/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i],
        unique:true,
        max:50
    },
    password:{
        type:String,
        required:true,
        min:8,
        max:20,
    },
    picturePath:{
        type:String,
        default:''
    },
    friends:{
        type:Array,
        default:[],
    },
    location:String,
    occupation:String,
    viewedProfile:Number,
    impressions:Number,

},{timestamps:true, versionKey:false})



const UserModel = mongoose.model('UserModel',userSchema)

export default UserModel
// WE WILL NOT USE THIS BCZ WE ADDED TYPE:MODULE ABOUT THIS FILE IN PACKAGE.JSON WE'LL IMPORT THINGS INSTEAD OF REQUIRING
// const express = require('express')
// const app = express();


import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet, { crossOriginResourcePolicy } from 'helmet';
import multer from 'multer';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url'; 
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/post.js";
import {createPost} from "./controllers/post.js";
import connectDB from './connectDB/connectDB.js';
import { register } from './controllers/auth.js';
import authentication from './middleware/authentication.js'
import UserModel from './models/user.js';
import Post from './models/post.js';
import { users, posts } from './data/index.js';


// configurations
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("common"))
app.use(bodyParser.json({limit:'30mb', extended:true}));
app.use(bodyParser.urlencoded({limit:'30mb', extended:true}));
app.use(cors())

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Credentials", "true")
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT")
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });
app.use('/assets', express.static(path.join(__dirname,"public/assets")))


// middleware


// routers


// file storage
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"public/assets")
    },
    filename:function(req,file,cb){
        cb(null, file.originalname);
    }   
})
const upload = multer({storage});


// routes with files => this is here bcz we don't want to move upload variable along with the below path also 
app.post('/auth/register',upload.single("picture"),register)
app.post ('/posts', authentication,upload.single("picture"), createPost )

// routes without files
    app.get('/', (req,res)=>{
        res.json('hello')
    })
app.use('/auth',authRoutes);
app.use('/users',authentication,userRoutes)
app.use('/posts', postRoutes)

// mongoose setup
const PORT = process.env.PORT || 6001;
const connect = async () =>{
    try {
        await connectDB(process.env.MONGO_URL)
        console.log("connected");
        // UserModel.insertMany(users);
        // Post.insertMany(posts)
        app.listen(PORT, ()=>{
            console.log(`hi`);
        })
    } catch (error) {
        console.log(error);
    }
}
connect();

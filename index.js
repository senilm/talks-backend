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
import connectDB from './connectDB/connectDB.js';
import authentication from './middleware/authentication.js'
import fileUpload from 'express-fileupload';

// configurations
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const app = express();
app.use(fileUpload({
    useTempFiles:true
}))
app.use(express.json());

app.use(morgan("common"))
app.use(bodyParser.json({limit:'30mb', extended:true}));
app.use(bodyParser.urlencoded({limit:'30mb', extended:true}));
const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }
 
app.use(cors(corsOptions))
app.use('/assets', express.static(path.join(__dirname,"public/assets")))


// middleware

// file storage
// const storage = multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null,"public/assets")
//     },
//     filename:function(req,file,cb){
//         cb(null, file.originalname);
//     }   
// })
// const upload = multer({storage});
// routes with files => this is here bcz we don't want to move upload variable along with the below path also 
// app.post ('/posts', authentication,createPost )


// routers
app.get('/', (req,res)=>{
        res.json('hello')
})
app.use('/auth',authRoutes);
app.use('/users',authentication,userRoutes)
app.use('/posts',authentication, postRoutes)

// mongoose setup
const PORT = process.env.PORT || 6001;
const connect = async () =>{
    try {
        await connectDB(process.env.MONGO_URL)
        console.log("connected to db");
        app.listen(PORT, ()=>{
            console.log(`listening on http://localhost:${PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}
connect();

import UserModel from "../models/user.js";
import bcrypt from 'bcrypt'
import jwt  from "jsonwebtoken";


export const register = async(req,res) =>{
    try 
    {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath, 
            friends,
            location,
            occupation
        } = req.body;
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = new UserModel({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile:Math.floor(Math.random() * 1000),
            impressions:Math.floor(Math.random() * 1000)
        })
    
        const savedUser = await newUser.save(newUser);
        res.status(200).json({savedUser})
    } catch (err) {
        res.status(500).json({ error:err.message })
    }

}

export const login = async (req,res) =>{
    
    try {
        const {email, password} = req.body;
        if(!email || !password){
            res.status(400).json({error:"provide email and password"})
        }

        const user = await UserModel.findOne({email:email})
        if (!user) {
            res.status(400).json({error:"user does not exist"})
            return
        }

        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
           return res.status(400).json({error:"Invalid password"})
        }

        const token = jwt.sign({id:user._id, name:user.name},process.env.SECRET_KEY)
        // delete user.password and then just send back the whole user object instead of just name so the password won't be shared
        delete user.password
        res.status(200).json({token, user})

    } catch (err) {
        res.status(500).json({ error:err.message })
    }
}

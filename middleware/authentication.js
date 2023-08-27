import jwt from "jsonwebtoken";

const authentication = (req,res,next)=>{

   
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(500).json({error:"please provide proper token"})
        return
    }

    // token= token.slice(7, token.length).trimLeft()
    const token = authHeader.split(' ')[1]

    try {
    const payload = jwt.verify(token, process.env.SECRET_KEY);

    
    // req.user = {id:payload.id, name:payload.name}
    req.user = {id:payload.id}
    next()


   } catch (err) {
    res.status(500).json(err)
   }
}
export default authentication
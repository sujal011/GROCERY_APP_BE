import jwt from "jsonwebtoken";

export const verifyToken = async(req,reply)=>{
    try{
        const authHeader = req.headers["authorization"];
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return reply.status(401).send({message:"Unauthorized: Access Token Required"});
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        if(!decoded){
            return reply.status(401).send({message:"Unauthorized "});
        }
        req.user = decoded;
        return true;

    }catch(err){
        return reply.status(401).send({message:"Unauthorized"});
    }
}
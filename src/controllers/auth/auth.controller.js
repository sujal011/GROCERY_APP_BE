import { createCustomer, findCustomerbyId, findCustomerByPhone, findDeliveryPartner, findDeliveryPartnerById } from "../../services/user.service.js";
import jwt from "jsonwebtoken";
import { generateTokens } from "../../services/user.service.js";

export const refreshToken = async (req,reply)=>{
    const {refreshToken} = req.body;
    if(!refreshToken){
        return reply.status(401).send({message:"Refresh Token required"});
    }
    try{
        const {userId,role} = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
        let user;
        if(role==="Customer"){
            user = await findCustomerbyId(userId);
        }else if(role==="DeliveryPartner"){
            user = await findDeliveryPartnerById(userId);
        }else{
            return reply.status(403).send({message:"Invalid user role"});
        }
        if(!user){
            return reply.status(404).send({message:"User not found"});
        }
        const {accessToken,refreshToken:newRefreshToken} = generateTokens(user);
        return reply.send({
            message:"Token Refresh successful",
            accessToken,
            refreshToken: newRefreshToken
        });
}
catch(err){
        return reply.status(403).send({message:"An error occured",err});
    }
}

export const loginCustomer = async(req,reply)=>{
    try{
        const {name,phone}=req.body;
        
        let customer = await findCustomerByPhone(phone);
        
        if(!customer){
            customer = await createCustomer(name,phone);
        }

        const {accessToken,refreshToken} = generateTokens(customer);
        return reply.send({
            message:"Login successful",
            accessToken,
            refreshToken,
            customer
        });
    }catch(err){
        return reply.status(500).send({message:"An error occured",err});
    }
}

export const loginDeliveryPartner = async(req,reply)=>{
    try{
        const {email,password}=req.body;
        
        const deliveryPartner = await findDeliveryPartner(email);
        if(!deliveryPartner){
            return reply.status(400).send({message:"Delivery Partner Not Found"});
        }
       const isMatch = password===deliveryPartner.password;
       if(!isMatch){
           return reply.status(400).send({message:"Invalid email or password"});
       }
        const {accessToken,refreshToken} = generateTokens(deliveryPartner);
        return reply.send({
            message:"Login successful",
            accessToken,
            refreshToken,
            deliveryPartner
        });
    }catch(err){
        return reply.status(500).send({message:"An error occured",err});
    }
}

export const fetchUser = async (req,replY)=>{
    try{
        const{userId,role}  = req.user;
        let user;
        if(role==="Customer"){
            user = await findCustomerbyId(userId);
        }else if(role==="DeliveryPartner"){
            user = await findDeliveryPartnerById(userId);
        }else{
            return replY.status(403).send({message:"Invalid user role"});
        }
        if(!user){
            return replY.status(404).send({message:"User not found"});
        }
        return replY.send({
            message:"User fetched successfully",
            user
        });
}catch(err){
        return replY.status(403).send({message:"An error occured",err});
    }
}

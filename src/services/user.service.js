import jwt from "jsonwebtoken";
import { Customer, DeliveryPartner } from "../models/index.js";

export const generateTokens = (user)=>{
    const accessToken = jwt.sign(
        {userId:user._id,role:user.role},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"1d"}
    );
    const refreshToken = jwt.sign(
        {userId:user._id,role:user.role},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:"7d"}
    );
    return {accessToken,refreshToken};
}


export const createCustomer = async(phoneNumber)=>{

    try{
        const customer = new Customer({
            phone:phoneNumber,
            role:"Customer",
            isActivated:true
        });
        return await customer.save(); 
    }catch(err){
        throw new Error(err);
    }

}
export const findCustomerByPhone = async(phoneNumber)=>{

    try{
        return await Customer.findOne({phone:phoneNumber});
    }catch(err){
        throw new Error(err);
    }

}

export const findCustomerbyId = async(id)=>{
    try{
        return await Customer.findById(id);
    }catch(err){
        throw new Error(err);
    }
}

export const findDeliveryPartner = async (email)=>{
    try{
        return await DeliveryPartner.findOne({
            email,
        });;
    }
    catch(err){
        throw new Error(err);
    }
}

export const findDeliveryPartnerById = async (id)=>{
    try{
        return await DeliveryPartner.findById(id);
    }catch(err){
        throw new Error(err);
    }
}

export const updateUserData = async(userId,user,updateData)=>{
    let UserModel;
        if(user.role==="Customer"){
            UserModel = Customer;
        }else if(user.role==="DeliveryPartner"){
            UserModel = DeliveryPartner;
        }else{
            return reply.status(403).send({message:"Invalid user role"});
        }
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {$set:updateData},
            {new:true,runValidators:true}
        )
        return updatedUser;
}

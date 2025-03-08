import { findCustomerbyId, findDeliveryPartnerById,updateUserData } from "../../services/user.service.js";

export const updateUser = async (req, reply) => {
    try{
        const {userId}=req.user;
        const updateData = req.body;

        let user = await findCustomerbyId(userId) || await findDeliveryPartnerById(userId);
        if(!user){
            return reply.status(404).send({message:"User not found"});
        }
        const updatedUser = await updateUserData(userId,user,updateData);
        if(!updatedUser){
            return reply.status(400).send({message:"Update failed"});
        }
        return reply.send({
            message:"User Updated successful",
            user:updatedUser
        });
    }catch(err){
        return reply.status(500).send({message:"An error occured",err});
    }

}
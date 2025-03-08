import { Category } from "../../models/index.js";

export const getAllCategories = async(req,reply)=>{
    try{
        const categories = await Category.find();
        return reply.send(categories);
    }catch(err){
        return reply.status(500).send({message:"An error occured",err});
    }
}
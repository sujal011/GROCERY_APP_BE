import { getProductsByCategoryId, getProductsByName } from "../../services/product.service.js";

export const getProductsByCategory = async(req,reply)=>{
    const {categoryId} = req.params;
    try{
        const products = await getProductsByCategoryId(categoryId);
        return reply.send(products);
    }catch(err){
        return reply.status(500).send({message:"An error occured",err});
    }
}

export const getProductsByNameController = async(req,reply)=>{
    const {name} = req.query;
    try{
        if(!name || name.trim() === ""){
            return reply.status(400).send({message:"Product name is required"});
        }
        const products = await getProductsByName(name);
        return reply.send(products);
    }catch(err){
        return reply.status(500).send({message:"An error occured",err});
    }
}
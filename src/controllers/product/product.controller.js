import { getProductsByCategoryId } from "../../services/product.service.js";

export const getProductsByCategory = async(req,reply)=>{
    const {categoryId} = req.params;
    try{
        const products = await getProductsByCategoryId(categoryId);
        return reply.send(products);
    }catch(err){
        return reply.status(500).send({message:"An error occured",err});
    }
}
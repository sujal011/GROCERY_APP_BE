import { Product } from "../models/index.js";

export const getProductsByCategoryId = async (id)=>{
    try{
        const products = await Product.find({
            category:id
        })
        .select("-category")
        .exec()

        return products;
}catch(err){
   throw new Error(err);
}
}

export const getProductsByName = async (name)=>{
    try{
        const products = await Product.find({
            name: new RegExp(name, 'i') // Case-insensitive search
        })
        .exec()

        return products;
    }catch(err){
        throw new Error(err);
    }
}
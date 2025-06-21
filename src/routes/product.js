import {getAllCategories} from "../controllers/product/category.controller.js";
import {getProductsByCategory, getProductsByNameController} from "../controllers/product/product.controller.js";

export const categoryRoutes  = async(fastify,opts)=>{
    fastify.get("/categories",getAllCategories);
}

export const productRoutes = async(fastify,opts)=>{
    fastify.get("/products/:categoryId",getProductsByCategory);  
    fastify.get("/products/search",getProductsByNameController);
}
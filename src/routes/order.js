import {confirmOrderController,createOrderController,getOrderByIdController,getOrdersController,updateOrderStatusController } from "../controllers/order/order.controller.js"
import { verifyToken } from "../middlewares/auth.middleware.js";

export const orderRoutes = async(fastify,opts)=>{
    fastify.addHook("preHandler",async(request,reply)=>{
        const isAuthenticate = await verifyToken(request,reply);
        if(!isAuthenticate){
           return reply.status(401).send({message:"Unauthorized"})
        }
    })

    fastify.post("/order",createOrderController);
    fastify.get("/order",getOrdersController);
    fastify.get("/order/:orderId",getOrderByIdController);
    fastify.patch("/order/:orderId/status",updateOrderStatusController);
    fastify.post("/order/:orderId/confirm",confirmOrderController);
}
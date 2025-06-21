import {Order} from "../../models/index.js";
import { createOrder, findOrderById } from "../../services/order.service.js";
import { findDeliveryPartnerById } from "../../services/user.service.js";

export const createOrderController = async(req, reply) => {
    try {
        const {userId} = req.user;
        const {items, branch, totalPrice} = req.body;

        // Validate required fields
        if (!items || !Array.isArray(items) || items.length === 0) {
            return reply.status(400).send({message: "Items array is required and cannot be empty"});
        }

        if (!branch) {
            return reply.status(400).send({message: "Branch ID is required"});
        }

        if (!totalPrice || totalPrice <= 0) {
            return reply.status(400).send({message: "Valid total price is required"});
        }

        const order = await createOrder(userId, items, branch, totalPrice);
        return reply.status(201).send({
            message: "Order created successfully",
            order
        });
    } catch (err) {
        console.error("Create order error:", err);
        return reply.status(500).send({
            message: "An error occurred while creating the order",
            error: err.message
        });
    }

}

export const confirmOrderController = async(req,reply)=>{
    try{

        const {orderId} = req.params;
        const {userId} = req.user;
        const {deliveryPersonLocation} = req.body;

        const deliveryPerson = await findDeliveryPartnerById(userId);
        if(!deliveryPerson){
            return reply.status(400).send({message:"Delivery person not found"});
        }
        const order = await findOrderById(orderId);
        if(!order){
            return reply.status(404).send({message:"Order not found"});
        } 
        if(order.status!=="available"){
            return reply.status(400).send({message:"Order not available for confirmation"});
        }
        order.status="confirmed";
        order.deliveryPartner=userId;
        order.deliveryPersonLocation={
            latitude:deliveryPersonLocation?.latitude,
            longitude:deliveryPersonLocation?.longitude,
            address:deliveryPersonLocation.address || "",
        }
        req.server.io.to(orderId).emit("orderConfirmed",order)
        await order.save();
        return reply.send({
            message:"Order confirmed successfully",
            order
        });

    }catch(err){
        return reply.status(500).send({message:"Failed to confirm order",err});
    }
}

export const updateOrderStatusController = async(req,reply)=>{
    try{
        const {orderId} = req.params;
        const {status,deliveryPersonLocation} = req.body;
        if(status !== "arriving" && status !== "delivered"){
            return reply.status(400).send({message:"Status is required"});
        }
        const {userId} = req.user;
        const deliveryPerson = await findDeliveryPartnerById(userId);
        if(!deliveryPerson){
            return reply.status(400).send({message:"Delivery person not found"});
        }

        const order = await findOrderById(orderId);
        if(!order){
            return reply.status(404).send({message:"Order not found"});
        }
        if(["cancelled","delivered"].includes(order.status)){
            return reply.status(400).send({message:"Order is already cancelled or delivered"});
        }
        if(order.deliveryPartner._id.toString() !== userId){
            return reply.status(403).send({message:"You are not authorized to update this order"});
        }
        order.status = status;
        order.deliveryPersonLocation=deliveryPersonLocation;
        await order.save();
        req.server.io.to(orderId).emit("liveTrackingUpdates",order);
        return reply.send({
            message:"Order status updated successfully",
            order
        });

    }catch(err){
        return reply.status(500).send({message:"Failed to update order status",err});
    }
}

export const getOrdersController = async(req,reply)=>{
    try{
        const {status,customerId,deliveryPartnerId,branchId} = req.query;
        let query={};
        if(status){
            query.status=status;
        }
        if(customerId){
            query.customer=customerId;
        }
        if(deliveryPartnerId && !branchId){
            return reply.status(400).send({message:"Branch Id is required"});
        }
        if(deliveryPartnerId){
            query.deliveryPartner=deliveryPartnerId;
            query.branch=branchId;
        }
        const orders = await Order.find(query).populate(
            "customer branch items.item deliveryPartner"
        )
        return reply.send(orders);
    }catch(err){
        return reply.status(500).send({message:"Orders could not be fetched: ",err});
    }
}

export const getOrderByIdController = async(req,reply)=>{
    try {
         const {orderId} = req.params;
        const order = await Order.findOne({orderId:orderId}).populate(
            "customer branch items.item deliveryPartner"
        );
        if(!order){
            return reply.status(404).send({message:"Order not found"});
        }
        return reply.send(order);
    } catch (error) {
        return reply.status(500).send({message:"Order could not be fetched",error});
    }
}
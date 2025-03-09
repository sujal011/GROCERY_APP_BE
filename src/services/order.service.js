import { Branch, Customer, Order } from "../models/index.js";

export const createOrder = async(customerId,items,branch,totalPrice)=>{

    try{
        const customerData = await Customer.findById(customerId);
        if(!customerData){
            throw new Error("Customer not found");
        }
        const branchData = await Branch.findById(branch);
        if(!branchData){
            throw new Error("Branch not found");
        }
        const newOrder = new Order({
            customer:customerId,
            items:items.map((item)=>({
                id:item.id,
                item:item.item,
                count:item.count
            })),
            branch,
            totalPrice,
            deliveryLocation:{
                latitude:customerData.liveLocation.latitude,
                longitude:customerData.liveLocation.longitude,
                address:customerData.address || "no addredss available"
            },
            pickupLocation:{
                latitude:branchData.location.latitude,
                longitude:branchData.location.longitude,
                address:customerData.address || "no addredss available"
            },
        })
        return await newOrder.save();
    }catch(err){
        throw new Error(err);
    }
}

export const findOrderById = async(id)=>{
    try{
        return await Order.findById(id);
    }catch(err){
        throw new Error(err);
    }
}

// export const findOrdersByQuery = async(query)=>{
//     try{
//         return await Order.find(query).pupulate(
//             "customer branch items.item deliveryPartner",
//         );
//     }catch(err){
//         throw new Error(err);
//     }
// }
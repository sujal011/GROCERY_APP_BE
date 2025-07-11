import { Branch, Customer, Order } from "../models/index.js";

export const createOrder = async(customerId, items, branch, totalPrice) => {
    try {
        // Validate input parameters
        if (!customerId || !items || !branch || !totalPrice) {
            throw new Error("Missing required parameters");
        }

        // Validate customer
        const customerData = await Customer.findById(customerId);
        if (!customerData || !customerData.liveLocation) {
            throw new Error("Customer not found or location not available");
        }

        // Validate branch
        const branchData = await Branch.findById(branch);
        if (!branchData || !branchData.location) {
            throw new Error("Branch not found or location not available");
        }

        const newOrder = new Order({
            customer: customerId,
            items: items.map((item) => ({
                id: item.id,
                item: item.item,
                count: item.count
            })),
            branch,
            totalPrice,
            deliveryLocation: {
                latitude: customerData.liveLocation.latitude,
                longitude: customerData.liveLocation.longitude,
                address: customerData.address || "no delivery address available"
            },
            pickupLocation: {
                latitude: branchData.location.latitude,
                longitude: branchData.location.longitude,
                address: branchData.address || "no pickup address available"
            },
        });

        let savedOrder = await newOrder.save();
        savedOrder = await savedOrder.populate([
            {path:"items.item"},
        ]);
        return savedOrder;
    } catch (err) {
        if (err.name === 'ValidationError') {
            throw new Error(`Validation error: ${err.message}`);
        }
        throw err;
    }
}

export const findOrderById = async(id)=>{
    try{
        if(!id){
            throw new Error("Order ID is required");
        }
        const foundOrder =  await Order.findOne({orderId: id}).populate(
            "customer branch items.item deliveryPartner",
        );
        if(!foundOrder || foundOrder.length === 0){
            throw new Error("Order not found");
        }
        return foundOrder
    }catch(err){
        comsole.error("Error finding order by ID:", err);
        throw new Error(err);
    }
}

export const findOrdersByQuery = async(query)=>{
    try{
        return await Order.find(query).populate(
            "customer branch items.item deliveryPartner",
        );
    }catch(err){
        throw new Error(err);
    }
}
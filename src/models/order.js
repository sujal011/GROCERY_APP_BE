import mongoose from "mongoose";
import Counter from "./counter.js";

const orderSchema = new mongoose.Schema({
    orderId: { 
        type: String, 
        unique: true
    },
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Customer",
        required:true,
    },
    deliveryPartner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"DeliveryPartner",
    },
    branch:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Branch",
        required:true,
    },
  items:[
    {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
            required:true,
        },
        item:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
            required:true,
        },
        count:{type:Number, required:true},
    },
  ],
  deliveryLocation:{
    latitude:{type:Number,required:true},
    longitude:{type:Number,required:true},
    address:{type:String},
  },
  pickupLocation:{
    latitude:{type:Number,required:true},
    longitude:{type:Number,required:true},
    address:{type:String},
  },
  deliveryPersonLocation:{
    latitude:{type:Number},
    longitude:{type:Number},
    address:{type:String},
  },
  status:{
        type:String,
        enum:["available","confirmed","arriving","delivered","cancelled"],
        default:"available",
  },
  totalPrice:{type:Number, required:true},
  createdAt:{type:Date, default:Date.now},
  updatedAt:{type:Date, default:Date.now},
})

async function getNextSequenceValue(sequenceName) {
    try {
        const sequenceDocument = await Counter.findOneAndUpdate(
            { name: sequenceName },
            { $inc: { sequence_value: 1 } },
            { new: true, upsert: true }
        );
        return sequenceDocument.sequence_value;
    } catch (error) {
        console.error('Error generating sequence:', error);
        throw error;
    }
}

orderSchema.pre('save', async function(next) {
    try {
        // Only generate orderId for new documents
        if (this.isNew) {
            const seqCount = await getNextSequenceValue('orderId');
            this.orderId = `ORD-${seqCount.toString().padStart(6, '0')}`;
        }
        this.updatedAt = new Date();
        next();
    } catch (error) {
        next(error);
    }
})

const Order = mongoose.model("Order",orderSchema);
export default Order
import fastifySession from "@fastify/session";
import ConnectMongoDBSession from "connect-mongodb-session";
import {Admin} from "../models/index.js";
import "dotenv/config";


export const PORT = 80;   
export const COOKIE_SECRET = process.env.COOKIE_SECRET

const MongoDBStore = ConnectMongoDBSession(fastifySession);

export const sessionStore = new MongoDBStore({
    uri:process.env.MONGO_URI,
    collection:"sessions"
})

sessionStore.on("error",(err)=>{
    console.log("Session Store Error: ",err);
})

export const authenticate = async(email,password)=>{
    if(email && password){
        const admin = await Admin.findOne({email})
        if(!admin){
            return null;
        }
        if(admin.password===password){
            return Promise.resolve({email:email,password:password})
        }else{
            return null
        }
}
}
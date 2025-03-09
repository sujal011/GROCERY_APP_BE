import 'dotenv/config';
import { connectDB } from './src/config/connect.js';
import fastify from 'fastify';
import { PORT } from './src/config/config.js';
import fastifySocketIO from 'fastify-socket.io';
import { registerRoutes } from './src/routes/index.js';
import { admin, buildAdminRouter } from './src/config/setup.js';

const start = async () => {     
    await connectDB(process.env.MONGO_URI);
    const app=fastify()
    app.register(fastifySocketIO,{
        cors:{
            origin:"*"
        },
        pingInterval:10000,
        pingTimeout:5000,
        transports:['websocket']
    })

    await registerRoutes(app);
    await buildAdminRouter(app);

    app.listen({port:PORT,host:'0.0.0.0'},(err,addr)=>{
        if(err){
            console.log("Failed to connect to DB ❌");
            console.log(err);
            return;
        }
        console.log(`Grocery App Server is running at http://localhost:${PORT}${admin.options.rootPath}`);
    })
    app.ready().then(()=>{
        app.io.on("connection",(socket)=>{
            console.log("User connected ✅",socket.id);
            socket.on("joinRoom",(orderId)=>{
                socket.join(orderId);
                console.log(`🔴User ${socket.id} joined room ${orderId}`);
            })
            socket.on("disconnect",()=>{
                console.log("User disconnected ❌",socket.id);
            })
        })
    })
    
}

start();

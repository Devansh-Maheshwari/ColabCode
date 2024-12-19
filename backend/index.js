const express=require("express");
const http=require('http');
const socketIo=require('socket.io');
const cors = require("cors");

const challengeRoutes = require('./routes/challengeRoute')
const submissionRoutes=require('./routes/submissionRoutes')
const userRoutes=require('./routes/userRoutes')
const chatRoutes=require('./routes/chatRoute');
const dashboardRoutes = require('./routes/dashboardRoutes')

require('dotenv').config();

const app=express();
const server=http.createServer(app);

const io = socketIo(server, {
    cors: {
      origin: "*", // Allow all origins or specify your client URLs
      methods: ["GET", "POST"]
    }
  });

const PORT=process.env.PORT ||4000;
require("./config/database").connect();

app.use(cors());
app.use(express.json());
app.use((req,res,next)=>{
    req.io=io;
    next();
})
app.use("/challenges",challengeRoutes);
app.use('/api',dashboardRoutes)
app.use("/api",submissionRoutes)
app.use('/',userRoutes)
app.use('/api/chats',chatRoutes);
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
  
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
server.listen(PORT ,()=>{
    console.log(`app running at port ${PORT}`);
})

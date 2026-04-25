import express from 'express'
import {Server} from 'socket.io'
import http from 'node:http'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
    }
}) // or instead of passing Server(server) can do like below
// this .attach

// io.attach(server)

app.get("/", (req , res)=>{
    res.json({
        message: "runs"
    })
})

server.listen(8080, () => {
    console.log("Server and Socket.IO running")
})

// sockets

const messageData = [];
const typingUsers = [];

io.on("connection", (socket)=>{
    console.log("connected")

    //messages
    socket.on("message", ({ roomId, name, message }) => {
        // console.log("message", roomId, message, )
        const messageObj = {
            type: "message",
            id: Date.now(),
            roomId,
            name,
            sent_at: new Date().toISOString(),
            message
        }

        messageData.push(messageObj)
        io.to(roomId).emit("message", messageData);
    });

    socket.on("get-messages", ({roomId, messageData: existingData}) => {
        console.log("get-messages", roomId)
        socket.emit("message", existingData);
    })

    // join room
    socket.on("join-room", (data)=>{
        console.log("join-room", data)
        socket.join(data.roomId)
        
        const messageObj = {
            type: "join-room",
            ...data
        }

        if(!messageData.filter(msg => msg.type === "join-room" && msg.name === data.name).length) {
            messageData.push(messageObj)
        }

        io.to(data.roomId).emit("message", messageData);
    })

    // typing updates
    socket.on("typing-update", ({roomId, name})=> {
        if(!typingUsers.includes(name)) {
            typingUsers.push(name)
        }
        io.to(roomId).emit("typing-update", typingUsers)
    })
    
    socket.on("typing-stop", ({roomId, name})=> {
        if(typingUsers.includes(name)) {
            typingUsers.splice(typingUsers.indexOf(name), 1)
        }
        io.to(roomId).emit("typing-update", typingUsers)
    })

    socket.on("leave-room", (data)=>{
        console.log(data)
        socket.leave(data.roomId)    
    })

})


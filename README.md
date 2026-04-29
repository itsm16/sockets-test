# Sockets Test

A real-time chat application built with Node.js, Express, and Socket.IO. This project demonstrates WebSocket functionality for creating interactive, multi-user chat rooms with typing indicators.

### demo-client
```
https://drive.google.com/file/d/1jguGTor89IHf1fZ4R8cvKDKs9dAegvLD/view?usp=sharing
```

## Features

- **Real-time messaging** - Instant message delivery between users in the same room
- **Room-based chat** - Users can join and leave different chat rooms
- **Typing indicators** - See when other users are typing a message
- **User presence** - Track when users join or leave rooms
- **CORS support** - Configured for frontend integration with localhost:3000

## API Endpoints

### HTTP
- `GET /` - Health check endpoint that returns `{"message": "runs"}`

### Socket.IO Events

#### Client to Server:
- `join-room` - Join a chat room
  ```javascript
  socket.emit("join-room", { roomId, name })
  ```
- `message` - Send a message to a room
  ```javascript
  socket.emit("message", { roomId, name, message })
  ```
- `get-messages` - Request existing messages for a room
  ```javascript
  socket.emit("get-messages", { roomId, messageData })
  ```
- `typing-update` - Notify that user is typing
  ```javascript
  socket.emit("typing-update", { roomId, name })
  ```
- `typing-stop` - Notify that user stopped typing
  ```javascript
  socket.emit("typing-stop", { roomId, name })
  ```
- `leave-room` - Leave a chat room
  ```javascript
  socket.emit("leave-room", { roomId, name })
  ```

#### Server to Client:
- `message` - Receive messages and room events
- `typing-update` - Receive list of users currently typing

## Message Format

Messages are stored with the following structure:
```javascript
{
  type: "message" | "join-room",
  id: timestamp,
  roomId: string,
  name: string,
  sent_at: ISO string,
  message: string // only for type "message"
}
```

## Configuration

The server is configured to accept connections from `http://localhost:3000` by default. To modify the CORS settings, update the configuration in `index.js`:

```javascript
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})
```

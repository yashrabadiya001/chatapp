const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

let rooms = {};

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinRoom', ({ username, room }) => {
        socket.join(room);

        if (!rooms[room]) rooms[room] = [];
        rooms[room].push(username);

        socket.to(room).emit('message', {
            username: 'System',
            message: `${username} joined the chat.`,
            timestamp: new Date().toLocaleTimeString(),
        });

        console.log(`${username} joined ${room}`);
    });

    socket.on('chatMessage', ({ room, username, message, timestamp }) => {
        io.to(room).emit('message', { username, message, timestamp });
        console.log(`${username} in ${room}: ${message}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

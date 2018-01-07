const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 8000;
var app = new express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New User connected');
    
    socket.emit('newMessage', {
        from: 'ABC',
        text: 'Some text',
        createdAt: 123
    });
    
    socket.on('createMessage', (message) => {
        console.log('Message recieved ', message);
    });
    
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(port, () => {
    console.log('App started at port ', port);
});
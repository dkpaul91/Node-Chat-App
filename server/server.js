const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 8000;
var app = new express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New User connected');
    
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat App'));
    
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));
    
    socket.on('createMessage', (message, callback) => {
        console.log('Message recieved ', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('This is from the server');
    });
    
    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });
    
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(port, () => {
    console.log('App started at port ', port);
});
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 8000;
var app = new express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

app.get('/getRooms', (req, res) => {
    res.send({activeRooms: users.getActiveRoomList()});
});

io.on('connection', (socket) => {
    console.log('New User connected');
    
    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and Room Name is required.');
        } else if (users.getUserByName(params.name)) {
            return callback('Name already exists in the room, use different name');
        }
        
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));        
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat App'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
        io.emit('newConnection', {});
        callback();
    });
    
    socket.on('createMessage', (message, callback) => {
        var user = users.getUser(socket.id);
        
        if (user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        
        callback();
    });
    
    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id);
        
        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
        
    });
    
    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);
        
        if(user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
            io.emit('newConnection', {});
        }
    });
});

server.listen(port, () => {
    console.log('App started at port ', port);
});
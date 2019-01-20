const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');
const mongoose = require('mongoose');
const connect = require('./db/db-connect');
//const deparam = require('./../public/js/libs/deparam');
//const jQuery = require('./../public/js/libs/jquery-3.3.1.min.js');

var {User,Chat,Message} = require('./db/user-shema');


const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

var publicPath = path.join(__dirname,'../public');

var users = new Users();

//console.log(publicPath);
var port = process.env.PORT || 3000;
var app = express();

app.use(express.static(publicPath));

var server = http.createServer(app);
var io = socketIO(server);

app.get('/about', (req, res) => {

    console.log('about page');
    res.send({
        name:'Rahul',
        age:24
    })
});

// var user = mongoose.model('User', User);

// var rahul = new user({name:'Rahul',age:24,address:'bhopal'});

// rahul.save( (err, user)=>{
//     if(err){
//         return console.log('cannot save data into collections!', err);
//     }
//     console.log(user);
// })

io.on('connection',(socket)=>{
    console.log('new user connected');

    // var chat = mongoose.model('Input', Chat);
    
    // socket.on('getInputs', (input) =>{
    //     var newInput = new chat(input);
    //     newInput.save( (err,tempInput)=>{
    //         if(err){
    //             return console.log('cannot insert the values', err);
    //         }
    //         console.log(tempInput);
    //     })
    // })

    // socket.emit('newMessage',{
    //     text: 'what are you doin',
    //     from: 'rahul'
    // })
  
      
  
  
  

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
          return callback('Name and room name are required.');
        }
    
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
    
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        var msg = mongoose.model('Message', Message);
        
        msg.find({room:params.room}, function (err, docs) {
            if(err){
              console.log('error occured in returning data');
            }else{
              console.log('msg: ',docs);
   
              var data;
              for(var i = 0; i < docs.length; i++){
                data = { name: docs[i].name,
                  room:  docs[i].room,
                  text:  docs[i].text,
                  createdAt:  docs[i].createdAt
                }
                console.log('data', data);
                io.sockets.connected[socket.id].emit('oldMessage', data);
              }
            }
            
        });
        
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
        callback();
      });
    
      socket.on('createMessage', (message, callback) => {
        var user = users.getUser(socket.id);
         console.log('message created: ',message);
        if (user && isRealString(message.text)) {

              var msg = mongoose.model('Message', Message);
              var obj = {
                name: user.name,
                room: user.room,
                text: message.text,
                createdAt: new Date().getTime()
              }
        
              var newInput = new msg(obj);
              newInput.save( (err,tempInput)=>{
              if(err){
                return console.log('cannot insert the values', err);
               }
               console.log('Recored inserted: ',tempInput);
           })
  
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
    
        if (user) {
          io.to(user.room).emit('updateUserList', users.getUserList(user.room));
          io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        }
      });

    socket.on('newMessage',(message)=>{
        console.log('messageReceived ',message);
        //callback('server response');
        io.emit('newMessage',{
            from: message.from,
            text: message.text
        })
    });
    

});

// app.get('/chat',(req, res)=>{
//     res.sendFile(__dirname + '/../public/chat/chat.html');
// });

server.listen(port, ()=>{
    console.log(`server up on port ${port}`);
});
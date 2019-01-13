const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');
const mongoose = require('mongoose');
const connect = require('./db/db-connect');
var {User,Chat} = require('./db/user-shema');

var publicPath = path.join(__dirname,'../public');

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

    socket.on('disconnect', ()=>{
        console.log('user disconnected');
    });
 
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

    socket.on('newMessage',(message)=>{
        console.log('messageReceived ',message);
        //callback('server response');
        io.emit('newMessage',{
            from: message.from,
            text: message.text
        })
    })
    

});

// app.get('/chat',(req, res)=>{
//     res.sendFile(__dirname + '/../public/chat/chat.html');
// });

server.listen(port, ()=>{
    console.log(`server up on port ${port}`);
});
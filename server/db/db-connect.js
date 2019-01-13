const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/chatdata', (err)=>{
    if(err){
        return console.log('cannnot connect to db: ',err);
    }
        console.log('connected to mongo database');
});
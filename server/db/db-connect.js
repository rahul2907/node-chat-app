const mongoose = require('mongoose');

var url = 'mongodb://localhost:27017/chatdata' || process.env.MONGOLAB_URI;
mongoose.connect(url, (err)=>{
    if(err){
        return console.log('cannnot connect to db: ',err);
    }
        console.log('connected to mongo database');
});
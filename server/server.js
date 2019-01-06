const express = require('express');

const path = require('path');

var publicPath = path.join(__dirname,'../public');

console.log(publicPath);

var app = express();

app.use(express.static(publicPath));

app.listen(3000, ()=>{
    console.log('server up on port 3000');
})
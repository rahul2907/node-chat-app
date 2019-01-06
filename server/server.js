const express = require('express');
const path = require('path');

var publicPath = path.join(__dirname,'../public');

//console.log(publicPath);
var port = process.env.PORT || 3000;
var app = express();

app.use(express.static(publicPath));

app.listen(port, ()=>{
    console.log(`server up on port ${port}`);
});
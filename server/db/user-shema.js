var mongoose = require('mongoose');

var schema = mongoose.Schema;
var User = new schema({
    name: String,
    age: Number,
    address: String
});

var Chat = new schema({
    name: String,
    room: String,
});

module.exports = {
    User: User,
    Chat: Chat
}

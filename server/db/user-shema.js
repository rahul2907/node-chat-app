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

var Message = new schema({
    name: String,
    room: String,
    text: String,
    createdAt: Number
})

module.exports = {
    User: User,
    Chat: Chat,
    Message: Message
}

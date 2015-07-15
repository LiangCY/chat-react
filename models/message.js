var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var messageSchema = mongoose.Schema({
    user: {type: ObjectId, ref: 'User'},
    content: String,
    date: Date
});

var Message = mongoose.model('Message', messageSchema);

module.exports = Message;
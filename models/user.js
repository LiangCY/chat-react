var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = mongoose.Schema({
    username: String,
    password: String,
    status: {type: Number, default: 0}
});

userSchema.pre('save', function (next) {
    var self = this;
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(self.password, salt, function (err, hash) {
            if (err) return next(err);
            self.password = hash;
            next()
        });
    })
});

userSchema.methods = {
    comparePassword: function (_password) {
        var user = this;
        return function (callback) {
            bcrypt.compare(_password, user.password, callback);
        }
    }
};

var User = mongoose.model('User', userSchema);

module.exports = User;
var mongoose = require("mongoose");

var Schema = new mongoose.Schema({
    user: String,
    email: String,
    password: String,
    wins: Number
});

Schema.statics.listAllUserWins = function(a) {
    console.log(a);
    return this.find({wins: {$gt: a}});
};

var User = mongoose.model('userdata', Schema);

module.exports = User;

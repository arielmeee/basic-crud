const mongoose = require('mongoose');

// Attributes of the User
var userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    }
});

mongoose.model('User', userSchema);
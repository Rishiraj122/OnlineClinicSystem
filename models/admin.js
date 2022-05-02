const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: [true, 'Name cannot be empty']
    },
    lastname:{
        type: String,
        required: [true,'Name cannot be empty']
    },
    mobile:{
        type: Number,
        required: [true,'Gender Cannot be Empty']
    },
    email:{
        type: String,
        required: [true, 'Username cannot be blank']
    },
    password:{
        type: String,
        required: [true, 'Password cannot be blank']
    }
})

module.exports=mongoose.model('Admin',userSchema);
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
    gender:{
        type: String,
        required: [true,'Gender Cannot be Empty']
    },
    address:{
        type: String,
        required: [true,'Address cannot be empty']
    },
    email:{
        type: String,
        required: [true, 'Username cannot be blank']
    },
    password:{
        type: String,
        required: [true, 'Password cannot be blank']
    },
    mobile:{
        type: Number,
        required: [true,'Mobile cannot be empty']
    },
    disease:{
        type: String,
        required: [true, 'Problem for which visiting the doctor']
    },
    date:{
        type:Date,
        required: [true, 'Date on which patient is available']
    },
    doctor:{
        type:String,
        required: [false,'Doctor Aloted']
    }
})

module.exports=mongoose.model('Patient',userSchema);
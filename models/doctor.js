const mongoose = require('mongoose');
const { timeout } = require('nodemon/lib/config');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Name cannot be empty']
    },
    specialization:{
        type: String,
        required: [true,' Cannot be Empty']
    },
    date:{
        type: Date,
        required: [true, 'Date cannot be blank']
    }
})

module.exports=mongoose.model('Doctor',userSchema);
const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 30,
    },
    email:{
        type: String,
        trim:true,//스페이스 없애주는 역할
    },
    password: {
        type: String,
        minlength: 6,
    },
    lastname: {
        type: String,
        maxlength: 30,
    },
    rold:{
        type: Number,
        default: 0,
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

const User = mongoose.model('user', userSchema)

module.exports = { User }

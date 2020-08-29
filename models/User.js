const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

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

userSchema.pre('save', function( next ){
    var user = this;
    if(user.isModified('password')){
        // 비밀번호 암호화
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)
    
            bcrypt.hash(user.password, salt, function(err, hash) {
                // Store hash in your password DB.
                if(err) return next(err)
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
})


userSchema.methods.comparePassword = function(plainPassword, cb){
    // 플레인 비번과 암호화된 비밀번호가 같은지 체크
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    })
}



userSchema.methods.generateToken = function(cb){
    var user = this;

    // jsonwebtoken 이용해서 token을 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken');

    user.token = token;
    user.save(function(err, user){
        if(err) return cb(err);
        cb(null, user);
    })
}

const User = mongoose.model('user', userSchema)

module.exports = { User }

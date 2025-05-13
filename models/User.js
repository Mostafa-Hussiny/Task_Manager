const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name:{
        type : String,
        required :[true, 'please provide name'],
        minlength : 3,
        maxlength : 50,
    },
    email:{
        type : String,
        required :[true, 'please provide email'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'please provide valid email'],
        unique: true
    },
    password:{
        type : String,
        required :[true, 'please provide password'],
        minlength : 6,
    }
})

UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWTcookie = function(res) {
    const token = jwt.sign({userId:this._id}, process.env.JWT_SECRET,{expiresIn:'15d'})
    res.cookie("Task-manager-jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in MS
		httpOnly: true, // prevent XSS attacks cross-site scripting attacks, make it not be accessed by JS
		sameSite: "strict", // CSRF attacks cross-site request forgery attacks
		secure: false,
	});

    return token
}

UserSchema.methods.comparePassword = async function (canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password)
    return isMatch
}


module.exports = mongoose.model('User', UserSchema)
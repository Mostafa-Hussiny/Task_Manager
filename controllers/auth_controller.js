const User = require('../models/User')
const asyncWrapper = require('../middleware/async')
const {createCustomError} = require('../errors/custom_error')



const signup = asyncWrapper(async (req, res) => {
    const user = await User.create({...req.body})

    console.log(user)
    user.createJWTcookie(res)
    res.status(201).json({user:{name: user.name, userId: user._id}})
})

const login = asyncWrapper(async (req, res) => {
    const {email, password} = req.body

    if (!email || !password) {
        return next(createCustomError(`please provide email and password`,400))
    }

    const user = await User.findOne({email})

    if (!user) {
        return next(createCustomError(`Invalid Credentials`,400))
    }

    const isPasswordCorrect = await user.comparePassword(password)

    if (!isPasswordCorrect) {
        return next(createCustomError(`Invalid Credentials`,400))
    }

    user.createJWTcookie(res)
    res.status(200).json({user:{name: user.name, userId: user._id}})
})

const logout = asyncWrapper(async (req, res) => {
    res.clearCookie("Task-manager-jwt");
    res.status(200).json({ success: true, message: "Logged out successfully" });
    console.log('loggedout')
})

const getme = asyncWrapper(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
})




module.exports= {
    signup,
    login,
    logout,
    getme
}
const express = require('express')
const router = express.Router()
const protectRoute = require('../middleware/protectRoute')

// importing controllers
const {
    signup,
    login,
    logout,
    getme
} = require('../controllers/auth_controller')


// routes
router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
router.get('/me', protectRoute, getme)



module.exports = router
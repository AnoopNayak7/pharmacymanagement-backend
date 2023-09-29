const Router = require('express').Router()
const userCtrl = require('../controllers/userController')

// Middleware Imports
const adminAuth = require('../middleware/auth')

// User Endpoints
Router.post(`/register`, userCtrl.register)

Router.post('/login', userCtrl.login)

Router.post('/refresh_token', userCtrl.getAccessToken)

Router.get('/logout', userCtrl.logout)


module.exports = Router
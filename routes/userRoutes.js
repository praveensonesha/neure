const express = require('express');
const router = express.Router();

const {authenticateToken} = require('../middleware/authMiddleware.js')

// Import controllers
const {signUpUser,loginUser} = require('../controllers/userController.js');


// Define user routes
router.post('/signup',signUpUser);
router.post('/login',loginUser);
// router.post('/request',authenticateToken,requestuser);


module.exports = router;

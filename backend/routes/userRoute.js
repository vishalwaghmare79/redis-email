const express = require('express');
const { registerController, loginController, requestPasswordReset, verifyOTP, setNewPassword } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerController);

router.post('/login', loginController);

router.post('/reset-password', requestPasswordReset);

router.post('/reset-password/verify', verifyOTP); 

router.post('/reset-password/new-password', setNewPassword); 

const userRoutes = router;
module.exports = userRoutes; 
let express = require('express');
let router = express.Router();

let passwordController = require('../controllers/password')

router.use('/forgotpassword',passwordController.postForgotPassword);

router.get('/resetpassword/:uuidv4',passwordController.getResetPassword);

router.get('/updatepassword/:requestId',passwordController.getUpdatePassword);

module.exports = router;
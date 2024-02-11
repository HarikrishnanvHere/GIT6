const express = require('express');

let userController = require('../controllers/user')

let router = express.Router();

router.post('/signup',userController.postSIgnUpUser);

router.post('/login',userController.postLogInUser);

module.exports = router;

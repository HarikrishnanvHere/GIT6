let jwt = require('jsonwebtoken');
let User = require('../models/user');

exports.getToken = (req,res,next) =>{
    let token = req.headers.authorization;
    let userId = jwt.verify(token,'harikrishnanv').userId;
    console.log(userId);
    
    User.findByPk(userId)
    .then((user)=>{
        req.user = user;
        //console.log(user);
        next();
    })
    .catch((err)=>{
        res.status(404).json({message: "user not found"});
    })
}
let jwt = require('jsonwebtoken');
let User = require('../models/user');

exports.getToken = async (req,res,next) =>{
    try{
        let token = req.headers.authorization;
        let userId = jwt.verify(token,'harikrishnanv').userId;
        console.log(userId);
        
        let user = await User.findByPk(userId);
        if(user){
            req.user = user;
            next();
        }
        else{
            throw new Error("Error");
        }
        
    }
    catch(err){
        res.status(404).json({message: "user not found"});
    }
    
}
//     .then((user)=>{
//         req.user = user;
//         //console.log(user);
//         next();
//     })
//     .catch((err)=>{
//         res.status(404).json({message: "user not found"});
//     })
// }
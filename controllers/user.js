let User = require('../models/user');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let dotenv = require('dotenv');
dotenv.config();
let token;

let cors = require('cors');

let express = require('express');
let app = express();
app.use(cors());

const hashrounds = 10;

exports.postSIgnUpUser = (req,res,next) =>{
    try{
        let name = req.body.name;
        let email = req.body.email;
        let password = req.body.password;
        //console.log(name,email,password);

        bcrypt.hash(password, hashrounds, async (err, hash) =>{
            console.log(err);
            await User.create({
                name: name,
                email: email,
                password: hash,
                total: 0
            })
            .then((data)=>{
                res.status(200).json({data: data});
            })
            .catch(err=>res.status(400).json({message: "user or email not unique"}));
        })
    }catch{
        (err=>res.send(err))
    }
}

function generateToken(id){
    token = jwt.sign({userId: id}, process.env.JWT_TOKEN_KEY);
    return token;
}

exports.postLogInUser = (req,res,next) =>{
    try{
        let email = req.body.email;
        let password = req.body.password;
        User.findAll({where: {email: email}})
        .then((data)=>{
            console.log(data);
            bcrypt.compare(password, data[0].password, (err, result)=>{
                if(err){
                    console.log(err);
                }
                else if(result === true){
                    res.status(200).json({token: generateToken(data[0].id), message: "login successful!"});
                }
                else if(result === false){
                    return res.status(400).json({message: "Error Code 400 - User Not Authorized!"});
                }
            })

        //     if(data.password === password){
        //         res.send("LogIn Successful");
        //     }
        //     else{
        //         res.send("Error Code 401 - User Not Authorized!");
        //     }
        })
        .catch(err=>{
            console.log("not found");
            return res.status(404).json({success: false, message: "Error Code 401 - User not Found!"});
         })
    }catch{
        (err=>console.log(err));
    }
}
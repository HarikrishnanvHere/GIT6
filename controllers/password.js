let dotenv = require('dotenv');
dotenv.config();

let Request = require('../models/forgotPassword');
let User = require('../models/user');

let bcrypt = require('bcrypt');

let express = require('express');
let app = express();
let cors = require('cors');
app.use(cors);

const uuid = require('uuid');

const Sib = require('sib-api-v3-sdk');


exports.postForgotPassword = async (req,res,next) =>{

    try{
        console.log(req);
        let recoveryMail = req.body.recoveryMail;
        console.log(recoveryMail);
        let uuidv4 = uuid.v4();

        let user = await User.findOne({where: {email: recoveryMail}})
        if(!user){
            throw new Error("Invalid email id");
        }
        let userId = user.id;
        console.log(userId);

        await Request.create({
            id : uuidv4,
            userId: userId,
            isactive: true
        })

        let url = `http://16.170.201.145:3000/password/resetpassword/${uuidv4}`;
        
        
        let BREVO_API_KEY = process.env.BREVO_API_KEY;
        console.log(BREVO_API_KEY);

        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications['api-key'];
        console.log(apiKey);
        apiKey.apiKey = BREVO_API_KEY;
        const tranEmailApi = new Sib.TransactionalEmailsApi()

        const sender = {
            email : 'itsmeharikrishnanv@gmail.com'
        }

        const receivers = [
            {
                email : recoveryMail
            }
        ]

        await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: "Test Mail",
            textContent : "Your password is HARI",
            htmlContent : `<a href="http://16.170.201.145:3000/password/resetpassword/${uuidv4}">reset password</a>`
        })
        .then(data=>{
            console.log(data);
            res.status(201).json({message: "e-mail successfully sent!!"})
        } )
        .catch(err=>console.log(err));
    }catch(err){
        console.log(err);
        res.status(401).json({message: err});
    }
    
}



exports.getResetPassword = async (req,res,next) =>{
    try{
        let requestId = req.params.uuidv4;
        let request = await Request.findByPk(requestId);
        // console.log(requestId);
        // console.log(request);
        if(!request){
            throw new Error("something went wrong!");
        }
        if(request.isactive === true){
            await request.update({isactive: false})
            res.status(200).send(
            `<html>
                <script>
                    function formsubmitted(e){
                        e.preventDefault();
                        console.log('called')
                    }
                </script>

                <form action="/password/updatepassword/${requestId}" method="get">
                    <label for="newpassword">Enter New password</label>
                    <input name="newPassword" type="password" required></input>
                    <button>reset password</button>
                </form>
            </html>`).then(()=>console.log("success"))
            .catch(err=>console.log(err))
            res.end();
        }
        else{
            res.status(200).send(
                `<html>
                    <h1>Link Expired</h1>
                </html>`)
                res.end();
        }
    }catch(err){
        console.log(err);
    }
}


exports.getUpdatePassword = async (req,res,next) =>{
    try{

        let requestId = req.params.requestId;
        let {newPassword} = req.query;
        console.log(newPassword);

        let request = await Request.findByPk(requestId).catch(err=>console.log(err))
        let user = await User.findOne({where: {id: request.userId}}).catch(err=>console.log(err));

        // encrypting password

        let hashrounds = 10;

        bcrypt.hash(newPassword, hashrounds, (err, hash) =>{
            if(err){
                res.send(`<html>
                            <h1>Something went wrong!</h1>
                        </html>`)
                res.end();
            }
            user.update({password: hash})
            .then(()=>{
                res.send(`<html>
                <h1>Password Updated!</h1>
                </html>`)
            })
            .catch((err)=>{
                res.send(`<html>
                <h1>Failed to Update Password!</h1>
                </html>`)
            })
        })


        }catch(err){
            console.log(err)
            res.send(`<html>
                <h1>Something went wrong!</h1>
                </html>`)
            res.end();

        }
    

}
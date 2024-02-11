let Order = require('../models/order');
let User = require('../models/user');
let Razorpay = require('razorpay');

let dotenv = require('dotenv');
dotenv.config();

let express= require('express');
let cors = require('cors');
let app = express();
app.use(cors());

let key_id_ = process.env.RAZORPAY_KEY_ID;
let key_secret_= process.env.RAZORPAY_KEY_SECRET;

exports.getPremium = (req,res,next) =>{
    try{
        //console.log(key_id,key_secret);
        let rzp = new Razorpay({
            key_id: key_id_,
            key_secret: key_secret_
        })

        const amount = 2500;
        rzp.orders.create({amount: amount, currency: "INR"}, (err, order)=>{
            if(err){
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({order_id: order.id, status: "PENDING"})
            .then(()=>{
                res.status(201).json({order,key_id_});
            })
            .catch((err)=>console.log(err))
        }).catch(err=>{
            throw new Error(err);
        })
    }catch(err){ 
        console.log(err);
        res.status(403).json({message: "order not created"})
    }
}

exports.update = async (req,res,next) =>{
    try{
        let {order_id, payment_id} = req.body;
        let order = await Order.findOne({where: {order_id: order_id}})
        if(payment_id){
            let promise1 = order.update({payment_id : payment_id, status: 'SUCCESSFUL'});
            let promise2 = req.user.update({isPremiumUser : true})
            Promise.all([promise1,promise2])
                .then(()=>res.status(200).json({success:true, message: "Transaction Successful!"}))
                .catch((err)=>console.log(err))
        }
        else{
            order.update({status: "FAILED"})
                .then(()=>res.send("Transaction Failed"))
                .catch((err)=>console.log(err));
        }





        // Order.findOne({where: {order_id: order_id}})
        // .then((order)=>{
        //     if(payment_id){
        //         order.update({payment_id : payment_id, status: 'SUCCESSFUL'})
        //         .then(()=>{
        //             req.user.update({isPremiumUser : true})
        //             .then(()=>{
        //                 res.status(200).json({success:true, message: "Transaction Successful!"})
        //             })
        //             .catch(err=>console.log(err));
        //         })
        //         .catch(err=>console.log(err));
        //     }
        //     else{
        //         order.update({status: "FAILED"})
        //         .then(()=>{
        //                 res.send("transaction failed")
        //         })
        //         .catch(err=>console.log(err));
        //     }
        // })clear
        // .catch(err=>console.log(err));
    }catch(err){
        res.status(403).json({success:false, message: "Transaction failed!"})
    }
    
}
let User = require('../models/user');
let Expense = require('../models/expense');

let express = require('express');
let cors = require('cors');
const sequelize = require('../database');
let app = express();
app.use(cors);

let Sequelize = require('sequelize');

exports.getLeaderboard = async (req,res,next) =>{
    try{

        console.log("hit success");
        User.findAll({
            attributes: ['id','name','total'], order: [['total','DESC']]
        })
        .then((data)=>res.status(200).json({data}))
        .catch(err=>console.log(err))

// using join:

        // let usersAndTotalAmount = await User.findAll({
        //     attributes: ['id','name',[sequelize.fn('sum',sequelize.col('amount')),'total']],
        //     include:[
        //         {
        //             model: Expense,
        //             attributes: []
        //         }
        //     ],
        //     group: ['User.id'],
        //     order: [['total',"DESC"]]
        // })
        // // let expenses = await Expense.findAll({
        // //     attributes: ['userId',]
        // // })

        // res.json({data: usersAndTotalAmount})
        
        
//Brute force soln: My Logic

        // let info = {};
        // let infoArranged = {};
        // let totalAmounts = [];
        // let users = await User.findAll();
        // for(let i=0;i<users.length;i++){
        //     info[users[i].name] = users[i].id;
        // }

        // for(let key in info){
        //     let sum = 0;
        //     let id = info[key];
        //     //console.log(id);
        //     let expenses = await Expense.findAll({where : {userId : id}})
        //     for (let j=0;j<expenses.length;j++){
        //         sum = sum + expenses[j].amount;
        //     }
        //     console.log(sum);
        //     info[key] = sum;
        //     totalAmounts.push(sum);
        // }

        // totalAmounts.sort((a,b)=>a-b);
        // totalAmounts.reverse();
        

        // for(let i=0;i<totalAmounts.length;i++){
        //     for(let j in info){
        //         if(info[j] === totalAmounts[i]){
        //             infoArranged[j] = totalAmounts[i];
        //         }
        //     }
        // }
        // res.status(200).json({success: true, info: infoArranged});

    }
    catch(err){
        console.log(err);
        res.status(400).json({success: false, message: "Please try again later"})
    }
    

}

let Expense = require('../models/expense');
let User = require('../models/user');
let DownloadUrl = require('../models/downloadUrl');

let sequelize = require('../database');


let cors = require('cors');
let express = require('express');
let app = express();
app.use(cors());

let AWS = require('aws-sdk');
let dotenv = require('dotenv');
const { SendReport } = require('sib-api-v3-sdk');
dotenv.config();


exports.postExpense = async (req,res,next) =>{
    try{
        let t = await sequelize.transaction();

        let {amount,description,category} = req.body;
        const data = await req.user.createExpense({
            amount: amount,
            description: description,
            category: category
        }, {transaction: t});
        let totalAmount = req.user.total + parseInt(amount);
        await req.user.update({total: totalAmount},{transaction: t});

        await t.commit();
        res.status(201).json({data: data})

        
        //Promise.all([promise1,promise2]).then(data=>res.status(200).json({data: data[0]})).catch(err=>res.status(400).json({message: "Invalid Entry"}));
    }
    catch (err){
        const t = await sequelize.transaction();
        await t.rollback();
        res.status(500).json({message: "Something went wrong! please try again"})
    }
    
}

exports.getExpense =async  (req,res,next) =>{
    try{

        const page = parseInt(req.query.page);
        const pageSize = parseInt(req.query.pageSize);
        const totalItems = await Expense.count({where :{userId: req.user.id}});

        console.log(page,pageSize);

        let isPremium = req.user.isPremiumUser;
        //console.log(isPremium);
        req.user.getExpenses({offset: (page -1) * pageSize, limit: pageSize})
        .then((expenses)=>{
            res.status(200).json({
                data:expenses, 
                currentPage: page,
                hasNextPage: pageSize * page < totalItems,
                nextPage: page + 1,
                hasPreviousPage: page > 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / pageSize),
                premium: isPremium
            });
            //console.log(expenses);
        })
        .catch(err=>console.log(err));
    }
    catch(err){
        console.log(err);
        res.send("Not Authorized");
    }
}

exports.deleteExpense = async (req,res,next) =>{
    try{

        const t = await sequelize.transaction();
        let expenseId = req.params.expenseId; 
        let expense = await Expense.findOne({where: {id: expenseId, userId: req.user.id}},{transaction: t});
        // console.log(expense);
        
        let updatedAmount =  parseInt(req.user.total) - parseInt(expense.amount);
        await expense.destroy({transaction: t});
        await req.user.update({total : updatedAmount}, {transaction: t});
        await t.commit();
        res.status(204).json({message: "Deletion Successful"});


        // let amount;
        // let expenseId = req.params.expenseId; 
        // let promise1 = await Expense.findAll({where: {id: expenseId, userId: req.user.id}})
        //     .then((expense)=>{
        //         amount = expense[0].amount;
        //         expense[0].destroy();
        //     })
        //     .catch(err=>{
        //         console.log(err);
        //     })
        // let updatedTotal = req.user.total - parseInt(amount);
        // let promise2 = await req.user.update({total: updatedTotal});

        // Promise.all([promise1,promise2])
        // .then((data)=>res.status(200).send(data))
        // .catch(err=>res.status(500).json({message: "Something went wrong!"}));
    }
    catch(err){
        const t = await sequelize.transaction();
        await t.rollback();
        res.status(500).json({message: "something went wrong"});
    }
    
}


async function uploadToS3 (data, fileName){
    let AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
    let AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
    let AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;

    let s3bucket = new AWS.S3({
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY
    })

    
    var params = {
        Bucket: AWS_BUCKET_NAME,
        Key: fileName,
        Body: data,
        ACL: 'public-read'
    }
    return new Promise ((resolve, reject) =>{
        s3bucket.upload(params, (err, s3response) =>{
            if(err){
                reject(err);
            }
            else{
                console.log("success",s3response);
                resolve(s3response.Location);
            }
        })
    
    }) 
     
    
  
}

exports.downloadExpense = async (req,res,next) =>{
    try{
        if(req.user.isPremiumUser != true){
            res.json({message: "Not Authorized"});
            res.end();
        }
        else{
            const userId = req.user.id;
            const expenses = await req.user.getExpenses();
            const stringifiedExpenses = JSON.stringify(expenses);
            const fileName = `Expenses${userId}/${new Date}.txt`;
            const fileNameSplit = fileName.split('/');
            const dataName = fileNameSplit[1];
            const fileUrl = await uploadToS3(stringifiedExpenses,fileName);
            await req.user.createDownloadUrl({
                url: fileUrl,
                filename: dataName
            })
            let previouslyDownloaded = await req.user.getDownloadUrls();
            res.status(200).json({url: fileUrl, previouslyDownloaded, message: "success"})
        }
    }
    catch(err){
        res.status(401).json({message: "Server Error!"})
    }
    
}
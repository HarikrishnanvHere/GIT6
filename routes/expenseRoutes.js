let express = require('express');
let router = express.Router();

let expenseController = require('../controllers/expense');
let middleware = require('../middleware/authorization')

router.post('/addexpense',middleware.getToken, expenseController.postExpense);

router.get('/getexpense',middleware.getToken, expenseController.getExpense);

router.get('/deleteexpense/:expenseId',middleware.getToken, expenseController.deleteExpense);

router.get('/download',middleware.getToken, expenseController.downloadExpense);

module.exports = router;


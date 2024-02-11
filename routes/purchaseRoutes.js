let express = require('express');
let router = express.Router();

let premiumController = require('../controllers/premium');
let middlewareController = require('../middleware/authorization');

router.get('/purchasepremium',middlewareController.getToken, premiumController.getPremium);
router.post('/updatetransactionstatus',middlewareController.getToken, premiumController.update)

module.exports = router;
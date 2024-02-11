let express = require('express');
let router = express.Router();

let premiumFeaturesController = require('../controllers/premiumFeatures');


router.get('/showleaderboard', premiumFeaturesController.getLeaderboard);

module.exports = router;
const express  = require('express');
const router = express.Router();

const {protect, restrictTo} = require('../controller/auth');
const { getStats } = require('../controller/statsController');


router.route('/').get( restrictTo('admin'), getStats);


module.exports = router;
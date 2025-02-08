const express  = require('express');
const router = express.Router();

const {protect, restrictTo} = require('../controller/auth');
const { getStats, getDocumentStats } = require('../controller/statsController');


router.route('/').get( restrictTo('admin'), getStats);
router.route('/chart').get( restrictTo('admin'), getDocumentStats);


module.exports = router;
const express = require("express");
const {
    getAllActivityLogs,
    getActivityLog,
} = require("../controller/activityLog");
const { restrictTo } = require("../controller/auth");
const router = express.Router();


router.use(restrictTo("admin"));

router.route("/").get(getAllActivityLogs);
router.route("/:id").get(getActivityLog);

module.exports = router;
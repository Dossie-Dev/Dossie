const express = require("express");
const multer = require("multer");
const { scanFolder } = require("../controller/scan/scanFolder");
const activityLogMiddleware = require("../utils/activityLogMiddleware");
const router = express.Router();


const upload = multer({ dest: "uploads/" });


router.post("/scan", upload.single("file"),activityLogMiddleware("Scanned Document Saved"), scanFolder);

module.exports = router;
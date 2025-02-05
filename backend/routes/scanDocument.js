const express = require("express");
const multer = require("multer");
const { scanFolder } = require("../controller/scan/scanFolder");
const router = express.Router();


const upload = multer({ dest: "uploads/" });


router.post("/scan", upload.single("file"), scanFolder);

module.exports = router;
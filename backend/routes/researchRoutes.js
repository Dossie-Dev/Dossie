const express = require("express");
const router = express.Router();
const {getAllResearchPapers, getOneResearchPaper, updateOneResearchPaper, deleteOneResearchPaper} = require("../controller/researchController/researchController");


router.route("/").get(getAllResearchPapers);
router.route("/:id").get(getOneResearchPaper).patch(updateOneResearchPaper).delete(deleteOneResearchPaper);

module.exports = router;

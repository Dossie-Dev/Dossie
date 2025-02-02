const express = require("express");
const { getAllResearchPapers, getOneResearchPaper, updateOneResearchPaper, deleteOneResearchPaper } = require("../controller/researchController/researchController");
const router = express.Router();


router.route("/").get(getAllResearchPapers);
router.route("/:id").get(getOneResearchPaper).patch(updateOneResearchPaper).delete(deleteOneResearchPaper);

module.exports = router;

const express = require("express");
const router = express.Router();
const {getAllResearchPapers, getOneResearchPaper, updateOneResearchPaper, deleteOneResearchPaper} = require("../controller/researchController/researchController");
const { addCompanyId } = require("../utils/addCompanyId");


router.route("/").get(addCompanyId, getAllResearchPapers);
router.route("/:id").get(getOneResearchPaper).patch(updateOneResearchPaper).delete(deleteOneResearchPaper);

module.exports = router;
    
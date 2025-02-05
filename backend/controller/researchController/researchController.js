// import the handler
const handleFactory = require("../handlerFactory");
const { ResearchPaper } = require("../../models/research.paper.model");


const getAllResearchPapers = handleFactory.getAll(ResearchPaper);
const getOneResearchPaper = handleFactory.getOne(ResearchPaper);
const updateOneResearchPaper = handleFactory.updateOne(ResearchPaper);
const deleteOneResearchPaper = handleFactory.deleteOne(ResearchPaper);



module.exports = {
    getAllResearchPapers,
    getOneResearchPaper,
    updateOneResearchPaper,
    deleteOneResearchPaper
}
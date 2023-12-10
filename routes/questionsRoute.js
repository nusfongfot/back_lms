const express = require("express");
const questionsController = require("../controllers/questionsController");

const router = express.Router();

router.get("/questions/all/:id", questionsController.getAllQuestionsOfCourse);
router.post("/questions/insert", questionsController.createQuestion);
router.post("/reply/insert", questionsController.replyQuestionByInStructor);

module.exports = router;

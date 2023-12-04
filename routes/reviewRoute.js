const express = require("express");
const reviewController = require("../controllers/reviewController");

const router = express.Router();

router.get("/reviews/course/:id", reviewController.getReviewOfCourse);
router.get("/reviews/star", reviewController.getReviewByStar);
router.post("/reviews/insert", reviewController.createReview);

module.exports = router;

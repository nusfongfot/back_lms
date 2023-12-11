const express = require("express");
const reviewController = require("../controllers/reviewController");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.get("/reviews/course/:id", reviewController.getReviewOfCourse);
router.get("/reviews/star", reviewController.getReviewByStar);
router.post("/reviews/insert", authenticate, reviewController.createReview);

module.exports = router;

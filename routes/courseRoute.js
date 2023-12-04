const express = require("express");
const courseController = require("../controllers/courseController");
const instructorAuth = require("../middleware/instructorAuth");

const router = express.Router();

router.put("/course/update/:id", instructorAuth, courseController.updateCourse);
router.put(
  "/course/publish",
  instructorAuth,
  courseController.updateCoursePublish
);
router.post("/course/insert", instructorAuth, courseController.createCourse);
router.delete("/course/:id", instructorAuth, courseController.deleteCourseById);

//not protect
router.get("/course/all", courseController.getAllCourse);
router.get("/course/:id",  courseController.getCourseById);
// not protect

router.put(
  "/lession/update/:id",
  instructorAuth,
  courseController.updateLession
);
router.delete(
  "/lession/delete/:id",
  instructorAuth,
  courseController.deleteLesson
);
router.post("/lession/insert", instructorAuth, courseController.addLession);
router.get("/lession/q", instructorAuth, courseController.getLession);


//about pay
router.get("/check-enrollment/:id",courseController.checkEnrollment);
router.post("/paid-enrollment/:id",courseController.paidEnrollment);
router.get("/stripe-success/:id",courseController.stripeSuccess);

module.exports = router;

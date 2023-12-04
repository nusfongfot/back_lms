const express = require("express");
const instructorController = require("../controllers/instructorController");
const instructorAuth = require("../middleware/instructorAuth");
const router = express.Router();

router.post("/instructor/insert", instructorController.makeInstructor);
router.get("/instructor/status", instructorController.getAccountStatus);

router.get(
  "/instructor/student-count",
  instructorAuth,
  instructorController.getStudentEnrolled
);
router.get(
  "/instructor/balance",
  instructorAuth,
  instructorController.getInstructorBalance
);
router.get(
  "/instructor/payout-settings",
  instructorAuth,
  instructorController.instructorPayoutSettings
);

router.get(
  "/instructor/courses",
  instructorAuth,
  instructorController.getInstructorCourses
);

router.get(
  "/instructor/current",
  instructorAuth,
  instructorController.currentInstructor
);

module.exports = router;

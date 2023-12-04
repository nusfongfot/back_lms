const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/user/course/:id", userController.getCourseUserById);
router.get("/user/browse/:id", userController.getDetailCourseBrowse);
router.put("/user/complete", userController.completeLessonById);

module.exports = router;

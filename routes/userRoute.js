const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/user/course/search", userController.searchCourse);
router.get("/user/course/filter", userController.filterCourse);
router.get("/user/course/:id", userController.getCourseUserById);
router.get("/user/browse/:id", userController.getDetailCourseBrowse);

router.get("/user/complete/:id", userController.getCompleteLessonOfUser);
router.post("/user/complete", userController.completeLessonOfUser);
router.put("/user/complete", userController.completeLessonById);

module.exports = router;

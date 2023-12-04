const express = require("express");
const profileController = require("../controllers/profileController");

const router = express.Router();

router.post("/profile/update", profileController.updateProfile);
router.post("/profile/image", profileController.updateImageProfile);
router.get("/profile", profileController.getProfile);

module.exports = router;

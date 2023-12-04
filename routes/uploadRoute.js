const express = require("express");
const uploadController = require("../controllers/uploadController");

const router = express.Router();

router.post("/upload/single/video", uploadController.uploadVideo);
router.post("/upload/single", uploadController.uploadImage);

module.exports = router;

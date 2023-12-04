const fs = require("fs");
const uploadServices = require("../services/uploadServices");

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.files) {
      return res.status(400).json({ message: "Image is required!" });
    }
    const sizeImg = req.files.file.size;
    if (sizeImg > 1024 * 1024) {
      return res.status(400).json({
        message: "File size exceeds 1 MB. Please choose a smaller file.",
      });
    }
    const path = req.files.file.tempFilePath;
    const image = await uploadServices.upload(path, "");
    return res.json({ image });
  } catch (error) {
    next(error);
    console.log(error);
  } finally {
    if (req.files) {
      fs.unlinkSync(req.files.file.tempFilePath);
    }
  }
};

exports.uploadVideo = async (req, res, next) => {
  try {
    if (!req.files) {
      return res.status(400).json({ message: "File is required!" });
    }

    const path = req.files.video.tempFilePath;
    const video = await uploadServices.uploadVideo(path, "");
    return res.json({ video });
  } catch (error) {
    next(error);
    res.send(error.message);
  } finally {
    if (req.files) {
      fs.unlinkSync(req.files.video.tempFilePath);
    }
  }
};

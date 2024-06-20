const express = require("express");
const cors = require("cors");
const app = express();
const fileUpload = require("express-fileupload");

const PORT = process.env.PORT_BASE || 3088;
const host = "0.0.0.0";
require("dotenv").config();

const courseRoute = require("./routes/courseRoute");
const authRoute = require("./routes/authRoute");
const instructorRoute = require("./routes/instructorRoute");
const profileRoute = require("./routes/profileRoute");
const uploadRoute = require("./routes/uploadRoute");
const userRoute = require("./routes/userRoute");
const reviewRoute = require("./routes/reviewRoute");
const questionsRoute = require("./routes/questionsRoute");

const authenticate = require("./middleware/authenticate");

// Allow,Parser
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//uploads
app.use(fileUpload({ useTempFiles: true }));
//ให้หน้าบ้านเข้าถึงไฟล์นี้
app.use("/uploads", express.static("uploads"));

app.use("/api/v1", authRoute);
app.use("/api/v1", courseRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1",  reviewRoute);
app.use("/api/v1", authenticate, profileRoute);
app.use("/api/v1", authenticate, instructorRoute);
app.use("/api/v1", authenticate, uploadRoute);
app.use("/api/v1", authenticate, questionsRoute);

app.listen(PORT, host, () => {
  console.log(`Listening on ${PORT}`);
});

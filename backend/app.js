const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const path = require("path");


const authRoutes = require("./auth/auth.routes");
const postsRoutes = require("./routes/posts");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Connection failed");
    console.log(err);
  });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  "/uploads/images",
  express.static(path.join("backend", "uploads", "images"))
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use((req, res, next) => {
  console.log("first middleware running");
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
// app.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });iojhio

module.exports = app;

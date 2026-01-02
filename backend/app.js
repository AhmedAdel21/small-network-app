const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");

mongoose
  .connect(
    "mongodb+srv://ahmed12365488_db_user:U1Yb0rflCX8PkrOp@cluster0.kssainu.mongodb.net/max-project"
  )
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Connection failed");
    console.log(err);
  });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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

app.use("/api/posts", postsRoutes);
// app.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });iojhio

module.exports = app;

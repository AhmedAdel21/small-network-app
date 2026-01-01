const express = require("express");
const bodyParser = require("body-parser");
const app = express();

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
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use((req, res, next) => {
  console.log("first middleware running");
  next();
});
const posts = [
  { id: "1", title: "First Post", content: "This is the first post" },
  { id: "2", title: "Second Post", content: "This is the second post" },
];
app.post("/api/posts", (req, res, next) => {
  console.log("post request received");
  const post = req.body;
  console.log(post);
  posts.push(post);
  res.status(201).json({
    message: "Post added successfully",
  });
});

app.get("/api/posts", (req, res, next) => {
  console.log("posts middleware running");

  res.status(200).json({
    message: "Posts fetched successfully",
    posts: posts,
  });
});

// app.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });iojhio

module.exports = app;

const express = require("express");
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log("first middleware running");
  console.log("Request method:", req.method);
  console.log("Request URL:", req.url);
  console.log("Request body:", req.body);
  next();
});
app.use((req, res, next) => {
  console.log("second middleware running");
  res.send("Hello World");
});

// app.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });iojhio

module.exports = app;

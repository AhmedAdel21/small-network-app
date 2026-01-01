const http = require("http");
const app = require("./backend/app");

const port = process.env.PORT || 3000;
app.set("port", port);

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// const express = require("express");
// const app = express();

// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

// app.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });

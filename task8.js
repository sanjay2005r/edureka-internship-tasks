const express = require("express");
const app = express();

app.use((req, res, next) => {
  const uniqueId = Date.now() + "-" + Math.floor(Math.random() * 1000);
  req.requestId = uniqueId;

  const timestamp = new Date().toISOString();
  const method = req.method;
  const route = req.originalUrl;

  console.log(`[${timestamp}] ${method} ${route} | RequestID: ${uniqueId}`);

  next();
});

app.get("/", (req, res) => {
  res.send(`Hello! Your request ID is ${req.requestId}`);
});

app.post("/post", (req, res)=>{
  res.send("This is post");
});

app.get("/user", (req, res) => {
  res.json({
    message: "User route hit",
    requestId: req.requestId
  });
});

app.listen(3000, () => {
  console.log("Task 8 server running on http://localhost:3000");
});
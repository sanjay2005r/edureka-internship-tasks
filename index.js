const express = require("express");
const app = express();

// app.get("/", (req, res) => {
//   // res.json({message : "Hello from Express"});
//   res.send("Hello from send");
//   // res.send("<p>Hello this is in html tag</p><b>Hi Express users</b>");
// });

// app.listen(3000, () => {
//   console.log("Server is running on http://localhost:3000/`");
// });


app.get("/", (req, res) => {
  res.send("Hello to Express Server");
});

app.get("/api/message", (req, res) => {
  res.json({
    message: "Hello from Express API",
    status: "Good"
  });
});

app.get("/greet", (req, res) => {
  const name = req.query.name || "Anonymous";
  res.send("Hello " + name);
});

app.get("/user/:id", (req, res) => {
  res.send("User ID is " + req.params.id);
});

app.get("/status", (req, res) => {
  if (req.query.active === "true") {
    res.send("User is active");
  } 
  else {
    res.send("User is inactive");
  }
});

app.get("/notfound", (req, res) => {
  res.status(404).send("Resource not found");
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./db");
// Request size limit (10kb)
app.use(express.json({ limit: "10kb" }));

//  RATE LIMITING ------ 

const rateLimitStore = {};

function rateLimiter(req, res, next) {
  const ip = req.ip;
  const currentTime = Date.now();

  if (!rateLimitStore[ip]) {
    rateLimitStore[ip] = { count: 1, startTime: currentTime };
    return next();
  }
  const elapsed = currentTime - rateLimitStore[ip].startTime;

  if (elapsed < process.env.REQUEST_WINDOW) {
    if (rateLimitStore[ip].count >= process.env.RATE_LIMIT) {
      return res.status(429).json({
        error: "Too many requests, please try again later"
      });
    }
    rateLimitStore[ip].count++;
    return next();
  } 
  else {
    rateLimitStore[ip] = { count: 1, startTime: currentTime };
    return next();
  }
}

//  LOG MASKING ----- 

function safeLogger(req, res, next) {
  const safeBody = { ...req.body };

  if (safeBody.password) safeBody.password = "***MASKED***";
  if (safeBody.token) safeBody.token = "***MASKED***";

  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`, safeBody);
  next();
}

app.use(rateLimiter);
app.use(safeLogger);

//  INPUT VALIDATION ------

app.post("/user/create", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email || typeof name !== "string" || typeof email !== "string") {
    return res.status(400).json({
      error: "Invalid payload"
    });
  }

  const sql = "INSERT INTO users (name, email) VALUES (?, ?)";
  db.query(sql, [name, email], (err, result) => {
    if (err) {
      return res.status(500).json({
        error: "Database error"
      });
    }

    res.json({
      message: "User created",
      id: result.insertId
    });
  });
});
// SAFE QUERY (SQL INJECTION PREVENTION)
app.get("/user/:id", (req, res) => {
const idParam = req.params.id;

if (!/^\d+$/.test(idParam)) {
  return res.status(400).json({
    error: "Invalid ID"
  });
}
const id = Number(idParam);
  const sql = "SELECT id, name, email FROM users WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Database error"
      });
    }
    if (results.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }
    res.json(results[0]);
  });
});
app.listen(process.env.PORT, () => {
  console.log(`Task 16 server running on port http://localhost:${process.env.PORT}`);
});
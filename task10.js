const express = require("express");
const app = express();
const db = require("./db"); // MySQL connection
app.use(express.json());

app.get("/user/all", (req, res) => {
  const sql = "SELECT * FROM users";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Failed to fetch users"
      });
    }

    res.json(results);
  });
});

app.get("/user/:id", (req, res) => {
  const id = req.params.id;

  const sql = "SELECT * FROM users WHERE id = ?";

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

app.post("/save_user", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      error: "Name and email are required"
    });
  }

  const sql = "INSERT INTO users (name, email) VALUES (?, ?)";

  db.query(sql, [name, email], (err, result) => {
    if (err) {
      return res.status(500).json({
        error: "Failed to save user"
      });
    }

    res.json({
      message: "User saved successfully",
      userId: result.insertId
    });
  });
});

app.listen(3000, () => {
  console.log("Task 10 server running on http://localhost:3000");
});
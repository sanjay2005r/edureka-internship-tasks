const express = require("express");
const app = express();
const db = require("./db"); // MySQL connection
app.use(express.json());

// app.get("/user/all", (req, res) => {
//   const sql = "SELECT * FROM users";

//   db.query(sql, (err, results) => {
//     if (err) {
//       return res.status(500).json({
//         error: "Failed to fetch users"
//       });
//     }

//     res.json(results);
//   });
// });

app.get("/user/all", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort || "id";

  const offset = (page - 1) * limit;

  const allowedSortFields = ["id", "name", "email"];
  if (!allowedSortFields.includes(sort)){
    return res.status(400).json({
      error: "Invalid sort field"
    });
  }
  const sql = `
    SELECT * FROM users
    ORDER BY ${sort} 
    LIMIT ? OFFSET ?
  `;

  db.query(sql, [limit, offset], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Failed to fetch users"
      });
    }
    res.json({
      page,
      limit,
      count: results.length,
      data: results
    });
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
// Task 11 PUT & DELETE :-
app.put("/user/:id",(req, res)=>{
  const id = req.params.id;
  const {name, email} = req.body;
  if (!name || !email){
    return res.status(400).json({
      error: "Name and email is required"
    });
  }
  const sql = "UPDATE users SET name=?, email=? WHERE id=?";
  db.query(sql, [name, email, id], (err, result)=>{
    if(err){
      return res.status(500).json({
        error : "Failed to update User"
      });
    }
    if(result.affectedRows === 0){
      return res.status(404).json({
        message:"User not Found"
      });
    }
    res.json({
      message:"User updated successfully"
    });
  });
});

app.delete("/user/:id",(req, res)=>{
  const id = req.params.id;
  const sql = "DELETE FROM users WHERE id = ?";

  db.query(sql, [id], (err, result)=>{
    if(err){
      return res.status(500).json({
        error:"Failed to delete user"
      })
    }
    if(result.affectedRows === 0){
      return res.status(404).json({
        message:"User not found"
      });
    }
    res.json({
      message:"User deleted successfully"
    });
  });
});

app.get("/user/details/:id", (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({
      error: "User ID is required"
    });
  } // prevents eempty and invalid values

  const sql = `
    SELECT 
      users.id,
      users.name,
      users.email,
      profiles.age,
      profiles.city,
      orders.product,
      orders.price
    FROM users
    INNER JOIN profiles ON users.id = profiles.user_id
    INNER JOIN orders ON users.id = orders.user_id
    WHERE users.id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Failed to fetch user details"
      });
    }
    if (results.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }
    res.json(results);
  });
});

app.listen(3000, () => {
  console.log("Task 10 server running on http://localhost:3000");
});
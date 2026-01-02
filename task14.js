const express = require("express"); // web server
const app = express();
const jwt = require("jsonwebtoken"); //create and verify JWT
const bcrypt = require("bcryptjs"); //compare hashed passwords
const db = require("./db");

app.use(express.json());

const JWT_SECRET = "my_secret_key";

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({
      error: "No token provided"
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "Invalid token format"
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {


    if (err) {
      return res.status(401).json({
        error: "Invalid or expired token"
      });
    }

    req.user = decoded;
    next();
  });
}

function roleMiddleware(requiredRole) {
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res.status(403).json({
        error: "Access denied"
      });
    }
    next();
  };
}

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  // 1. Validate input
  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required"
    });
  }
  // 2. Fetch user from DB
  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Database error"
      });
    }
    if (results.length === 0) {
      return res.status(401).json({
        error: "Invalid credentials"
      });
    }

    const user = results[0];
    // 3. Compare password
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid credentials"
      });
    }
    // 4. Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    // 5. Send token
    res.json({
      message: "Login successful",
      token: token,
      role: user.role
    });
  });
});

app.get("/user/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user
  });
});

app.get("/user/admin", authMiddleware, roleMiddleware("admin"),(req, res) =>{
    res.json({ message: "Welcome Admin" });
  }
);
app.listen(3000, () => {
  console.log("Task 14 auth server running on http://localhost:3000");
});
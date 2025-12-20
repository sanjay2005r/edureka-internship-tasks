const express = require("express");
const app = express();
app.use(express.json());

app.get("/user/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      error: "Invalid or missing user id"
    });
  }
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const users = await response.json();

    const user = users.find(u => u.id === id);

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    if (id % 2 !== 0) {
      return res.status(400).json({
        error: "User ID is odd, even IDs only allowed"
      });
    }
    
    res.json(user);
  } 
  catch (error) {
    res.status(500).json({
      error: "Failed to fetch users"
    });
  }
});

app.listen(3000, () => {
  console.log("Task 7 server running on http://localhost:3000");
});

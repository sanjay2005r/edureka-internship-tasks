const express = require("express");
const app = express();
app.use(express.json());

app.get("/user/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  // 1. ID validation
  if (isNaN(id)) {
    return res.status(400).json({
      error: "Invalid or missing user id"
    });
  }
  try {
    // 2. Fetch users from external API
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const users = await response.json();

    // 3. Filter users with EVEN IDs
    const evenUsers = users.filter(user => user.id % 2 === 0);

    // 4. Find user with given ID
    const user = evenUsers.find(user => user.id === id);

    // 5. If user not found
    if (!user) {
      return res.status(404).json({
        error: "User not found or ID is not even"
      });
    }
    else if(users.id == 3){
        res.json(user);
    };

    // 6. Send user data
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

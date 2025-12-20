const express = require("express");
const app = express();
app.use(express.json());
let users = [];

app.get("/user_details", (req, res) => {
  res.json({
    name: "Gopal",
    age: 25,
    role: "Customer"
  });
});

app.post("/save_user", (req, res) => {
  console.log("Body received:", req.body);

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      error: "No user data received"
    });
  }

  users.push(req.body);

  res.json({
    message: "User saved successfully"
  });
});

app.get("/find_user",(req, res)=>{
    const name = req.query.name;
    const token = req.get("Auth_token");
    console.log(token);
    // if (!token){
    //     return res.status(401).json({
    //         error : "No Auth_token"
    //     });
    // }
    if (token !== "abc123"){
        return res.status(403).json({
            error : "invalid token"
        });
    }
    if (!name){
        return res.status(400).json({
            error : "Name parameter is required"
        });
    }
    const user = users.find(u => u.name === name);
    
    if(!user){
        return res.status(404).json({
            error : "User not found"
        })
    }
    res.json(user);
});

app.get("/all_users", (req, res) => {
  res.json(users);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

const express = require("express");
const app = express();
const db = require("./db");
const multer = require("multer");
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/file/upload", upload.single("file"), (req, res) => {
  // 1. Check if file is received
  if (!req.file) {
    return res.status(400).json({
      error: "No file uploaded"
    });
  }
  const filename = req.file.originalname;

  // 2. Convert file buffer to Base64
  const fileBase64 = req.file.buffer.toString("base64");

  // 3. SQL query to save file
  const sql = "INSERT INTO files (filename, filedata) VALUES (?, ?)";

  db.query(sql, [filename, fileBase64], (err, result) => {
    if (err) {
      return res.status(500).json({
        error: "Failed to save file"
      });
    }

    res.json({
      message: "File uploaded successfully",
      filename: filename
    });
  });
});

app.get("/file/get/:filename", (req, res) => {
  const filename = req.params.filename;

  const sql = "SELECT filedata FROM files WHERE filename = ?";

  db.query(sql, [filename], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Failed to fetch file"
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "File not found"
      });
    }

    // Convert Base64 back to buffer
    const fileBuffer = Buffer.from(results[0].filedata, "base64");

    // Tell browser it's a file download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );

    res.send(fileBuffer);
  });
});

app.listen(4000, () => {
  console.log("Task 13 server running on http://localhost:4000");
});
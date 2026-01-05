const express = require("express");
const app = express();
const multer = require("multer");
const fs = require("fs");
const readline = require("readline");
const db = require("./db");

app.use(express.json());

// Multer config (file saved to disk)
const upload = multer({ dest: "uploads/" });

// Upload CSV & start background processing
app.post("/file/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filename = req.file.filename;

  // Insert job with status PENDING
  const sql = "INSERT INTO file_jobs (filename, status) VALUES (?, ?)";

  db.query(sql, [filename, "pending"], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to create job" });
    }

    const jobId = result.insertId;

    // Background processing
    setImmediate(() => processCSV(jobId, req.file.path));

    // Respond immediately (non-blocking)
    res.json({
      message: "File uploaded, processing started",
      jobId: jobId
    });
  });
});

// Background CSV processor
function processCSV(jobId, filePath) {
  const stream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: stream });

  let isHeader = true;

  rl.on("line", (line) => {
    if (isHeader) {
      isHeader = false;
      return;
    }

    const [name, email, age] = line.split(",");

    if (!name || !email || !age) return;

    const sql = "INSERT INTO users (name, email) VALUES (?, ?)";

    db.query(sql, [name, email], () => {});
  });

  rl.on("close", () => {
    db.query(
      "UPDATE file_jobs SET status = ? WHERE id = ?",
      ["completed", jobId]
    );

    fs.unlinkSync(filePath); // cleanup
  });
}

// Check file processing status
app.get("/file/status/:id", (req, res) => {
  const jobId = req.params.id;

  const sql = "SELECT status FROM file_jobs WHERE id = ?";

  db.query(sql, [jobId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch status" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({
      jobId: jobId,
      status: results[0].status
    });
  });
});

app.listen(3000, () => {
  console.log("Task 15 server running on http://localhost:3000");
});

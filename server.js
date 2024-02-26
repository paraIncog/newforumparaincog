const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 4000;

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Handle requests to index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Endpoint to fetch users
app.get("/get-users", (req, res) => {
  let db = new sqlite3.Database("./database.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Internal Server Error");
    }

    db.all("SELECT id, username FROM users", (err, rows) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Internal Server Error");
      }
      res.json(rows);
    });
  });
});

// Endpoint to fetch forum posts
app.get("/get-forums", (req, res) => {
  let db = new sqlite3.Database("./database.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Internal Server Error");
    }

    db.all("SELECT id, title, author, content, created_at FROM posts", (err, rows) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Internal Server Error");
      }
      res.json(rows);
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

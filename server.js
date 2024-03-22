const express = require("express");
const session = require("express-session");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to parse JSON data in the request body
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Initialize session middleware
app.use(session({
  secret: 'your_secret_key', // Change this to a secret key
  resave: false,
  saveUninitialized: true
}));

// Handle requests to index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Endpoint to handle login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  let db = new sqlite3.Database("./database.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Internal Server Error");
    }

    db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Internal Server Error");
      }

      if (!row) {
        return res.status(401).json({ error: "Invalid username or password." });
      }

      // Authentication successful, store user information in session
      req.session.user = row;

      res.json({ message: "Login successful", username: row.username }); // Return the username
    });
  });
});

// Check if user is logged in
function isLoggedIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

// Endpoint to get the username of the logged-in user
app.get("/get-username", (req, res) => {
  if (req.session && req.session.user && req.session.user.username) {
      res.json({ username: req.session.user.username });
  } else {
      res.status(401).json({ error: "User not logged in or username not found in session" });
  }
});

// Endpoint to check session status
app.get("/check-session", (req, res) => {
  if (req.session && req.session.user) {
      // Session exists and user is logged in
      res.sendStatus(200); // Send a success status code
  } else {
      // Session doesn't exist or user is not logged in
      res.sendStatus(401); // Send an unauthorized status code
  }
});

// Endpoint to handle user registration
app.post("/register", (req, res) => {
  const { username, password, namefirst, namelast, email, gender, age } = req.body;

  let db = new sqlite3.Database("./database.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Internal Server Error");
    }

    // Prepare the SQL statement for inserting the user into the database
    const insertQuery = `INSERT INTO users (username, password, namefirst, namelast, email, gender, age) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    // Execute the SQL query to insert the user into the database
    db.run(insertQuery, [username, password, namefirst, namelast, email, gender, age], function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Internal Server Error");
      }

      // Return success message
      res.json({ message: "Registration successful", username: username });
    });
  });
});

// Endpoint to fetch users
app.get("/get-users", (req, res) => {
  let db = new sqlite3.Database("./database.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Internal Server Error");
    }

    db.all("SELECT id, username, age, namefirst, namelast, email FROM users", (err, rows) => {
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

    db.all("SELECT id, title, author, content, created_at, category FROM posts", (err, rows) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Internal Server Error");
      }
      res.json(rows);
    });
  });
});

// Endpoint to fetch a specific user by ID
app.get("/get-user", (req, res) => {
  const userId = req.query.id; // Extract userId from query parameters
  let db = new sqlite3.Database("./database.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Internal Server Error");
    }

    db.get("SELECT id, username, age, namefirst, namelast, email FROM users WHERE id = ?", [userId], (err, row) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Internal Server Error");
      }
      if (!row) {
        return res.status(404).send("User not found");
      }
      res.json(row);
    });
  });
});

// Endpoint to fetch a specific forum post by ID
app.get("/get-forum", (req, res) => {
  const postId = req.query.id;
  let db = new sqlite3.Database("./database.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Internal Server Error");
    }

    db.get("SELECT id, title, author, content, created_at, category FROM posts WHERE id = ?", [postId], (err, row) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Internal Server Error");
      }
      if (!row) {
        return res.status(404).send("User not found");
      }
      res.json(row);
    });
  });
});

// Endpoint to handle addition of forum post
app.post("/add-forum-post", isLoggedIn, (req, res) => {
  const { title, category, content } = req.body;
  const author = req.session.user.username; // Extract author's username from session

  // Check if all required fields are provided
  if (!title || !category || !content || !author) {
      return res.status(400).json({ error: "Title, category, content, and author are required." });
  }

  let db = new sqlite3.Database("./database.db", sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
          console.error(err.message);
          return res.status(500).send("Internal Server Error");
      }

      // Prepare the SQL statement for inserting the forum post into the database
      const insertQuery = `INSERT INTO posts (title, content, author, category) VALUES (?, ?, ?, ?)`;

      // Execute the SQL query to insert the forum post into the database
      db.run(insertQuery, [title, content, author, category], function (err) {
          if (err) {
              console.error(err.message);
              return res.status(500).send("Internal Server Error");
          }

          // Return success message
          res.json({ message: "Forum post added successfully" });
      });
  });
});

// Add endpoint to handle adding comments
app.post("/add-comment", isLoggedIn, (req, res) => {
  const { postId, commentContent } = req.body;
  const author = req.session.user.username; // Extract author's username from session

  // Check if all required fields are provided
  if (!postId || !commentContent || !author) {
    return res.status(400).json({ error: "Post ID, comment content, and author are required." });
  }

  let db = new sqlite3.Database("./database.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Internal Server Error");
    }

    // Prepare the SQL statement for inserting the comment into the database
    const insertQuery = `INSERT INTO posts_comments (post_id, author, content) VALUES (?, ?, ?)`;

    // Execute the SQL query to insert the comment into the database
    db.run(insertQuery, [postId, author, commentContent], function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Internal Server Error");
      }

      // Return success message
      res.json({ message: "Comment added successfully" });
    });
  });
});

// Endpoint to fetch comments for a specific forum post
app.get("/get-comments", (req, res) => {
  const postId = req.query.id;
  let db = new sqlite3.Database("./database.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Internal Server Error");
    }

    db.all("SELECT id, post_id, author, content, created_at FROM posts_comments WHERE post_id = ?", [postId], (err, rows) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Internal Server Error");
      }
      res.json(rows);
    });
  });
});

// Endpoint to handle logout
app.get("/logout", (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Internal Server Error");
    }
    res.redirect("/"); // Redirect to the login page after logout
  });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

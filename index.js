import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { Server } from "socket.io"
import session from 'express-session'
import sqlite3 from 'sqlite3'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express();
const PORT = process.env.PORT || 4000;
const PMSG = "Pmsg"


// Middleware to parse JSON data in the request body
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")))

const expressServer = app.listen(PORT, () => {
  console.log(`Listening on: http://localhost:${PORT}`)
})

// Users State
const UsersState = {
  users: [],
  setUsers: function (newUsersArray) {
      this.users = newUsersArray
  }
}

const io = new Server(expressServer, {
  cors: {
    origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5500", "http://127.0.0.1:5500"]
  }
})

io.on('connection', socket => {
  console.log(`User ${socket.id} connected`)

  // Upon connection - To main user
  socket.emit('message', "Welcome to Real Time Forums")

  // Upon connection - To other users
  socket.broadcast.emit('message', `User ${socket.id.substring(0, 20)} connected`)

  // Listening for message event
  socket.on('message', data => {
    console.log(data)
    io.emit('message', `${socket.id.substring(0, 20)}: ${data}`)
  })

  // User disconnect - To other users
  socket.on('disconnect', () => {
    socket.broadcast.emit('message', `User ${socket.id.substring(0, 20)} disconnected`)
  })

  // Listen for activity
  socket.on('activity', (name) => {
    socket.broadcast.emit('activity', name)
  })
})

// User functions 
function activateUser(id, name, room) {
  const user = { id, name, room }
  UsersState.setUsers([
      ...UsersState.users.filter(user => user.id !== id),
      user
  ])
  return user
}

function userLeavesApp(id) {
  UsersState.setUsers(
      UsersState.users.filter(user => user.id !== id)
  )
}

function getUser(id) {
  return UsersState.users.find(user => user.id === id)
}

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

      res.json({ message: "Login successful", username: row.username, userid: row.id }); // Return the username
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
  if (req.session.user.username) {
      res.json({ username: req.session.user.username });
  } else {
      res.status(401).json({ error: "User not logged in or username not found in session" });
  }
});

// Endpoint to get the user id of the logged-in user
app.get("/get-user-id", (req, res) => {
  if (req.session.user.id) {
      res.json({ username: req.session.user.id });
  } else {
      res.status(401).json({ error: "User not logged in or user id not found in session" });
  }
});

// Endpoint to check session status
app.get("/check-session", (req, res) => {
  if (req.session.user) {
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

    db.all("SELECT id, title, author, content, datetime(created_at, 'localtime') localtime, category FROM posts", (err, rows) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Internal Server Error");
      }

      // Format created_at timestamp before sending it in the response
      const formattedRows = rows.map(row => ({
        ...row,
        created_at: row.localtime
      }));

      res.json(formattedRows);
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

      // Format created_at timestamp before sending it in the response
      const formattedRows = rows.map(row => ({
        ...row,
        created_at: new Date(row.created_at).toLocaleDateString('et-EE', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone:'Europe/Tallinn' }) + ', ' +
                     new Date(row.created_at).toLocaleTimeString('et-EE', { hour: '2-digit', minute: '2-digit', timeZone:'Europe/Tallinn' })
      }));

      res.json(formattedRows);
    });
  });
});

// Endpoint to fetch friends of a specific user
app.get("/get-users", (req, res) => {
  const userId = req.query.id; // Extract userId from query parameters
  
  let db = new sqlite3.Database("./database.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Internal Server Error");
    }

    db.all("SELECT u.username, u.id, max(created_at) FROM users u LEFT OUTER JOIN messages m ON m.sender_id = u.id GROUP BY u.username, u.id ORDER BY m.created_at DESC, u.username", [userId], (err, rows) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Internal Server Error");
      }

      // Format created_at timestamp before sending it in the response
      const formattedRows = rows.map(row => ({
        ...row,
        created_at: row.localtime,
        // isOnline: activeConnections.get(`${row.id}`) != null
      }));

      res.json(formattedRows);
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

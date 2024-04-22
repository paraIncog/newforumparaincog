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
const ADMIN = "Admin"


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

  // Upon connection - only to user 
  socket.emit('message', buildMsg(ADMIN, "Welcome to Chat App!"))

  socket.on('enterRoom', ({ name, room }) => {

      const defaultRoom = "General";
      room = room.trim() ? room.trim() : defaultRoom;

      // leave previous room 
      const prevRoom = getUser(socket.id)?.room

      if (prevRoom) {
          socket.leave(prevRoom)
          io.to(prevRoom).emit('message', buildMsg(ADMIN, `${name} has left the room`))
      }

      const user = activateUser(socket.id, name, room)

      // Cannot update previous room users list until after the state update in activate user 
      if (prevRoom) {
          io.to(prevRoom).emit('userList', {
              users: getUsersInRoom(prevRoom)
          })
      }

      // join room 
      socket.join(user.room)

      // To user who joined 
      socket.emit('message', buildMsg(ADMIN, `You have joined the ${user.room} chat room`))

      // To everyone else 
      socket.broadcast.to(user.room).emit('message', buildMsg(ADMIN, `${user.name} has joined the room`))

      // Update user list for room 
      io.to(user.room).emit('userList', {
          users: getUsersInRoom(user.room)
      })

  })

  // When user disconnects - to all others 
  socket.on('disconnect', () => {
      const user = getUser(socket.id)
      userLeavesApp(socket.id)

      if (user) {
          io.to(user.room).emit('userList', {
              users: getUsersInRoom(user.room)
          })
      }

      console.log(`User ${socket.id} disconnected`)
  })

  // Listening for a message event 
  socket.on('message', ({ name, text }) => {
      const room = getUser(socket.id)?.room
      if (room) {
          io.to(room).emit('message', buildMsg(name, text))
      }
  })

  // Listen for activity 
  socket.on('activity', (name) => {
      const room = getUser(socket.id)?.room
      if (room) {
          socket.broadcast.to(room).emit('activity', name)
      }
  })
})

function buildMsg(name, text) {
  return {
      name,
      text,
      time: new Intl.DateTimeFormat('default', {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric'
      }).format(new Date())
  }
}

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

function getUsersInRoom(room) {
  return UsersState.users.filter(user => user.room === room)
}

function getAllActiveRooms() {
  return Array.from(new Set(UsersState.users.map(user => user.room)))
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
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ error: "name and password are required." });
  }

  let db = new sqlite3.Database("./database.db", sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Internal Server Error");
    }

    db.get("SELECT * FROM users WHERE name = ? AND password = ?", [name, password], (err, row) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Internal Server Error");
      }

      if (!row) {
        return res.status(401).json({ error: "Invalid name or password." });
      }

      // Authentication successful, store user information in session
      req.session.user = row;

      res.json({ message: "Login successful", name: row.name, userid: row.id }); // Return the name
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

// Endpoint to get the name of the logged-in user
app.get("/get-name", (req, res) => {
  if (req.session.user.name) {
      res.json({ name: req.session.user.name });
  } else {
      res.status(401).json({ error: "User not logged in or name not found in session" });
  }
});

// Endpoint to get the user id of the logged-in user
app.get("/get-user-id", (req, res) => {
  if (req.session.user.id) {
      res.json({ name: req.session.user.id });
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
  const { name, password, namefirst, namelast, email, gender, age } = req.body;

  let db = new sqlite3.Database("./database.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Internal Server Error");
    }

    // Prepare the SQL statement for inserting the user into the database
    const insertQuery = `INSERT INTO users (name, password, namefirst, namelast, email, gender, age) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    // Execute the SQL query to insert the user into the database
    db.run(insertQuery, [name, password, namefirst, namelast, email, gender, age], function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Internal Server Error");
      }

      // Return success message
      res.json({ message: "Registration successful", name: name });
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

    db.all("SELECT id, name, age, namefirst, namelast, email FROM users", (err, rows) => {
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

    db.get("SELECT id, name, age, namefirst, namelast, email FROM users WHERE id = ?", [userId], (err, row) => {
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
  const author = req.session.user.name; // Extract author's name from session

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
  const author = req.session.user.name; // Extract author's name from session

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

    db.all("SELECT u.name, u.id, max(created_at) FROM users u LEFT OUTER JOIN messages m ON m.sender_id = u.id GROUP BY u.name, u.id ORDER BY m.created_at DESC, u.name", [userId], (err, rows) => {
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

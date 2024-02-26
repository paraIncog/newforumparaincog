const sqlite3 = require("sqlite3").verbose();

// Open database
let db = new sqlite3.Database(
  "./database.db",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the chinook database.");
  }
);

db.serialize(() => {
  db.each(`SELECT id, username, age, namefirst, namelast, email FROM users`, (err, row) => {
    if (err) {
      console.error(err.message);
    }
    console.log(row.id + "\t" + row.username + "\t" + row.namelast + "\t" + row.namefirst);
  });
});

// Close database
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Close the database connection.");
});

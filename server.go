package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

func main() {
	// Initialize SQLite database
	initDB()

	// Define HTTP routes
	http.HandleFunc("/login", loginHandler)
	http.HandleFunc("/register", registerHandler)
	http.HandleFunc("/get-forums", getForumsHandler)
	// Add more handlers for other endpoints as needed

	// Serve static files (HTML, CSS, JS)
	http.Handle("/", http.FileServer(http.Dir("public")))

	// Start the server
	fmt.Println("Server is running at http://localhost:4000")
	log.Fatal(http.ListenAndServe(":4000", nil))
}

func initDB() {
	var err error
	db, err = sql.Open("sqlite3", "database.db")
	if err != nil {
		log.Fatal(err)
	}

	// Create tables if they don't exist
	_, err = db.Exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            namefirst TEXT,
            namelast TEXT,
            email TEXT UNIQUE,
            age INTEGER,
            gender TEXT
        );
    `)
	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec(`
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            content TEXT,
            author TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `)
	if err != nil {
		log.Fatal(err)
	}
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	// Handle login request
}

func registerHandler(w http.ResponseWriter, r *http.Request) {
	// Handle registration request
}

func getForumsHandler(w http.ResponseWriter, r *http.Request) {
	// Handle request to fetch forum posts
	// Retrieve data from the database and return as JSON
}

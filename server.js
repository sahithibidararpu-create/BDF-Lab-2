
const express = require("express");
const db = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("Lab 2 Server is Running");
});

// Create table
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL
        )
    `);
});

// Get all students
app.get("/students", (req, res) => {
    db.all("SELECT * FROM students", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Add a student
app.post("/students", (req, res) => {
    const { name, email } = req.body;

    db.run(
        "INSERT INTO students (name, email) VALUES (?, ?)",
        [name, email],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({
                message: "Student added successfully",
                id: this.lastID
            });
        }
    );
});

// 404 route
app.use((req, res) => {
    res.status(404).send("404 - Page Not Found");
});



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

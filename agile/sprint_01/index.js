const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();

app.use(cors());
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Set up the database
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

// Create a table for TODO items if it doesn't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed BOOLEAN NOT NULL DEFAULT 0
    )`);
});

// API Endpoints will go here

// Create a new TODO item
app.post('/todos', (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }
    const sql = `INSERT INTO todos (title) VALUES (?)`;
    db.run(sql, [title], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, title, completed: false });
    });
});

// Get all TODO items
app.get('/todos', (req, res) => {
    const sql = `SELECT * FROM todos`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ todos: rows });
    });
});

// Update a TODO item
app.put('/todos/:id', (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    if (typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Completed is required and must be a boolean' });
    }
    const sql = `UPDATE todos SET completed = ? WHERE id = ?`;
    db.run(sql, [completed, id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'TODO item not found' });
        }
        res.json({ message: 'TODO item updated successfully' });
    });
});

// Delete a TODO item
app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM todos WHERE id = ?`;
    db.run(sql, id, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'TODO item not found' });
        }
        res.json({ message: 'TODO item deleted successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// In-memory data store
let complaints = [];
let nextId = 1;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Routes
// GET /complaints - Get all complaints
app.get('/complaints', (req, res) => {
    res.json(complaints);
});

// GET /complaints/:id - Get complaint by ID
app.get('/complaints/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const complaint = complaints.find(c => c.id === id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json(complaint);
});

// POST /complaints - Add complaint
app.post('/complaints', (req, res) => {
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(400).json({ message: 'Title and description required' });
    }

    const newComplaint = {
        id: nextId++,
        title,
        description,
        status: 'pending' // Default status
    };
    complaints.push(newComplaint);
    res.status(201).json(newComplaint);
});

// PUT /complaints/:id - Update status
app.put('/complaints/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'resolved', 'rejected'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    const complaint = complaints.find(c => c.id === id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.status = status;
    res.json(complaint);
});

// DELETE /complaints/:id - Delete complaint
app.delete('/complaints/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = complaints.findIndex(c => c.id === id);

    if (index === -1) return res.status(404).json({ message: 'Complaint not found' });

    complaints.splice(index, 1);
    res.status(204).send();
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

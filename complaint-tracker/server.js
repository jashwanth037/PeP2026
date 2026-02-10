const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

let complaints = [];
let nextId = 1;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/complaints', (req, res) => {
    res.json(complaints);
});

app.get('/complaints/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const complaint = complaints.find(c => c.id === id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json(complaint);
});

app.post('/complaints', (req, res) => {
    const { title, description, email, phone } = req.body;

    if (!title || !description || !email) {
        return res.status(400).json({ message: 'Missing required fields (title, description, or email)' });
    }

    const newComplaint = {
        id: nextId++,
        title,
        description,
        email,
        phone: phone || 'N/A',
        status: 'pending'
    };

    complaints.push(newComplaint);
    res.status(201).json(newComplaint);
});

app.put('/complaints/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    const validStatuses = ['pending', 'resolved', 'rejected'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    const complaint = complaints.find(c => c.id === id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.status = status;
    res.json(complaint);
});

app.delete('/complaints/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = complaints.findIndex(c => c.id === id);

    if (index === -1) return res.status(404).json({ message: 'Complaint not found' });

    complaints.splice(index, 1);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

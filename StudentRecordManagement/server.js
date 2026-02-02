const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());

const dataFilePath = path.join(__dirname, 'data.json');

const readStudentsFromFile = () => {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { students: [] };
    }
};

const writeStudentsToFile = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
};

const generateId = (students) => {
    if (students.length === 0) return 1;
    const maxId = Math.max(...students.map(s => s.id));
    return maxId + 1;
};

app.post('/students', (req, res) => {
    try {
        const { name, email, course } = req.body;

        if (!name || !email || !course) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required: name, email, course'
            });
        }

        const data = readStudentsFromFile();

        const emailExists = data.students.find(s => s.email === email);
        if (emailExists) {
            return res.status(409).json({
                success: false,
                message: 'A student with this email already exists'
            });
        }

        const newStudent = {
            id: generateId(data.students),
            name,
            email,
            course
        };

        data.students.push(newStudent);
        writeStudentsToFile(data);

        res.status(201).json({
            success: true,
            message: 'Student created successfully',
            data: newStudent
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating student',
            error: error.message
        });
    }
});

app.get('/students', (req, res) => {
    try {
        const data = readStudentsFromFile();
        res.status(200).json({
            success: true,
            count: data.students.length,
            data: data.students
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching students',
            error: error.message
        });
    }
});

app.get('/students/:id', (req, res) => {
    try {
        const studentId = parseInt(req.params.id);

        if (isNaN(studentId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid student ID'
            });
        }

        const data = readStudentsFromFile();
        const student = data.students.find(s => s.id === studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: `Student with ID ${studentId} not found`
            });
        }

        res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching student',
            error: error.message
        });
    }
});

app.put('/students/:id', (req, res) => {
    try {
        const studentId = parseInt(req.params.id);
        const { name, email, course } = req.body;

        if (isNaN(studentId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid student ID'
            });
        }

        if (!name && !email && !course) {
            return res.status(400).json({
                success: false,
                message: 'At least one field (name, email, course) is required for update'
            });
        }

        const data = readStudentsFromFile();
        const studentIndex = data.students.findIndex(s => s.id === studentId);

        if (studentIndex === -1) {
            return res.status(404).json({
                success: false,
                message: `Student with ID ${studentId} not found`
            });
        }

        if (email) {
            const emailExists = data.students.find(s => s.email === email && s.id !== studentId);
            if (emailExists) {
                return res.status(409).json({
                    success: false,
                    message: 'A student with this email already exists'
                });
            }
        }

        const updatedStudent = {
            ...data.students[studentIndex],
            name: name || data.students[studentIndex].name,
            email: email || data.students[studentIndex].email,
            course: course || data.students[studentIndex].course
        };

        data.students[studentIndex] = updatedStudent;
        writeStudentsToFile(data);

        res.status(200).json({
            success: true,
            message: 'Student updated successfully',
            data: updatedStudent
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating student',
            error: error.message
        });
    }
});

app.delete('/students/:id', (req, res) => {
    try {
        const studentId = parseInt(req.params.id);

        if (isNaN(studentId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid student ID'
            });
        }

        const data = readStudentsFromFile();
        const studentIndex = data.students.findIndex(s => s.id === studentId);

        if (studentIndex === -1) {
            return res.status(404).json({
                success: false,
                message: `Student with ID ${studentId} not found`
            });
        }

        const deletedStudent = data.students.splice(studentIndex, 1)[0];
        writeStudentsToFile(data);

        res.status(200).json({
            success: true,
            message: 'Student deleted successfully',
            data: deletedStudent
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting student',
            error: error.message
        });
    }
});

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Student Record Management API',
        endpoints: {
            'POST /students': 'Create a new student',
            'GET /students': 'Get all students',
            'GET /students/:id': 'Get a student by ID',
            'PUT /students/:id': 'Update a student by ID',
            'DELETE /students/:id': 'Delete a student by ID'
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Student Record Management API is ready!`);
});

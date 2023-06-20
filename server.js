//Model the data
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: String,
    age: Number,
    major: String,
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now }
});

const Student = mongoose.model('Student', studentSchema);

//Create the database connection
mongoose.connect('mongodb://localhost:27017/studentDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Failed to connect to MongoDB', err));

//Set up express and necessary middleware
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

//Rroute habdlers
// GET all students
app.get('/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.send(students);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// GET a single student by id
app.get('/students/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).send({ message: 'Student not found' });
        }
        res.send(student);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// POST a new student
app.post('/students', async (req, res) => {
    try {
        let student = new Student(req.body);
        student = await student.save();
        res.send(student);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// PUT (update) a student by id
app.put('/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!student) {
            return res.status(404).send({ message: 'Student not found' });
        }
        res.send(student);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// DELETE a student by id
app.delete('/students/:id', async (req, res) => {
    try {
        const result = await Student.findByIdAndRemove(req.params.id);
        if (!result) {
            return res.status(404).send({ message: 'Student not found' });
        }
        res.send('Student deleted successfully');
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

//Listen
app.listen(3000, () => console.log('Server is running on port 3000'));

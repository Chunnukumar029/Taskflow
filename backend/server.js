const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let tasks = [];
let nextId = 1;

app.get('/', (req, res) => {
    res.send('TaskFlow Backend Running!');
});

app.get('/task', (req, res) => {
    res.json(tasks);
});

app.get('/tasks', (req, res) => {
    res.json(tasks);
});

const createTask = (req, res) => {
    const title = String(req.body?.title || '').trim();

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    const newTask = {
        id: nextId++,
        title,
        completed: false
    };

    tasks.push(newTask);
    return res.status(201).json(newTask);
};

app.post('/task', createTask);
app.post('/tasks', createTask);

app.put('/task/:id', (req, res) => {
    const task = tasks.find(t => t.id == req.params.id);
    if (!task) return res.status(404).json({ error: 'Not found' });

    task.completed = req.body.completed;
    res.json(task);
});

app.put('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id == req.params.id);
    if (!task) return res.status(404).json({ error: 'Not found' });

    task.completed = req.body.completed;
    res.json(task);
});

app.delete('/task/:id', (req, res) => {
    tasks = tasks.filter(t => t.id != req.params.id);
    res.json({ message: 'Deleted' });
});

app.delete('/tasks/:id', (req, res) => {
    tasks = tasks.filter(t => t.id != req.params.id);
    res.json({ message: 'Deleted' });
});

app.listen(5000, () => {
    console.log('TaskFlow Backend Running on port 5000');
});
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.json({
        message: "Hello from Node.js App!",
        status: "running"
    });
});

app.get('/health', (req, res) => {
    res.json({ health: "ok" });
});

app.get('/add', (req, res) => {
    const a = parseInt(req.query.a);
    const b = parseInt(req.query.b);
    res.json({ result: a + b });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});

module.exports = app;  // exported for testing
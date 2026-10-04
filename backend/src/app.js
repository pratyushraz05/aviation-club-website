const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: "Aviation Club API is running successfully!" });
});

module.exports = app;
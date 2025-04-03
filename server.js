const express = require('express');
const connectDB = require('./src/config/db'); // đường dẫn đúng
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

connectDB();

app.get('/', (req, res) => {
  res.send('MongoDB Connected');
});

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});

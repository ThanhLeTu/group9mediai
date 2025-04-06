const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));


app.get('/', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'index.ejs')));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));
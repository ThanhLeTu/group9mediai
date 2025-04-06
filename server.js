const express = require('express');
const path = require('path');
require('dotenv').config();

const connectDB = require('./src/config/db');
const webRoutes = require('./src/routes/web');
const apiRoutes = require('./src/routes/api');

const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/static', express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

app.use('/', webRoutes);
app.use('/api', apiRoutes);   

// Route test
app.get('/register', (req, res) => {
  res.render('register');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

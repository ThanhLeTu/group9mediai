require('dotenv').config();
const mongoose = require('mongoose');

const user = process.env.DB_USER;
const pass = process.env.DB_PASSWORD;
const dbName = process.env.DB_DATABASE;

const db = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${user}:${pass}@mediai.7zgkkdl.mongodb.net/group9mediAI?retryWrites=true&w=majority&appName=mediAI`);
        console.log('✅ MongoDB connected successfully!');
    } catch (err) {
        console.error('❌ Connection error:', err.message);
        process.exit(1);
    }
};

module.exports = db;

require('dotenv').config();
const app = require('./server');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3002;

mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    }); 
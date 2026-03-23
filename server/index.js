const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    res.send('Optimus API is running');
});

const authRoutes = require('./routes/auth');

app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

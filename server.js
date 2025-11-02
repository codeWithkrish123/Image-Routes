require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const imageRoutes = require('./routes/images');

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://image-processing-tool-c7k8.vercel.app/"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);

// health
app.get('/api/ping', (req, res) => res.json({ ok: true }));

// error handler
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

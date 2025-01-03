const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const route = require("./routes/routes");
const connection = require("./database/db");

const app = express();
const PORT = process.env.PORT || 8080;

// Enable CORS before other middleware
app.use(cors({
    origin: function(origin, callback) {
        const allowedOrigins = ['https://fe-b4blog.vercel.app', 'http://localhost:3000'];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Pre-flight requests
app.options('*', cors());

// File upload middleware
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    createParentPath: true
}));

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', route);

// Error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message,
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Database connection
connection();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const route = require("./routes/routes")
const connection = require("./database/db")
const cors = require("cors");
const fileUpload = require("express-fileupload");

// CORS configuration
const corsOptions = {
    origin: ['https://fe-b4blog.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 86400
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

const PORT = process.env.PORT || 8080;

// File upload configuration with CORS
app.use(fileUpload({
    useTempFiles: true,
    createParentPath: true,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
}));

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Global CORS headers middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Routes
app.use("/", route);

// Database connection
connection();

app.listen(PORT, () => console.log("server started on", PORT));
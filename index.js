const express = require("express");
const mongoose = require("mongoose");
const app = express();
const route = require("./routes/routes")
const connection = require("./database/db")
const cors = require("cors");
const fileUpload = require("express-fileupload");

// CORS configuration
app.use(cors({
    origin: "https://fe-b4blog.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400 // 24 hours
}));

// Configure Express to handle pre-flight requests
app.options("*", cors());

const PORT = process.env.PORT || 8080

// File upload configuration
app.use(fileUpload({
    useTempFiles: true,
}));

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/", route)

// connecting to the dataBase
connection();

app.listen(PORT, () => console.log("server started on", PORT));
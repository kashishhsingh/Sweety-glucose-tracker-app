
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");
const authRoutes = require("./routes/authRoutes");
const readingRoutes = require("./routes/readingRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.get("/test", (req, res) => {
    res.send("Test route is working!");
});
app.use("/api/auth", authRoutes);
app.use("/api/readings", readingRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
    res.send("Sweety Glucose Tracker API is running!");
});

pool.query("SELECT NOW()")
    .then(() => {
        console.log("PostgreSQL connected successfully!");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Database connection failed:", error.message);
    });

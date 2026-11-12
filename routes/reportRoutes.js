
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getReport } = require("../controllers/reportsController");

router.get("/", authMiddleware, getReport);

module.exports = router;

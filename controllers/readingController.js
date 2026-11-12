
const pool = require("../db");

// Add a new glucose reading
const addReading = async (req, res) => {
    try {
        const { reading_date, time_slot, value } = req.body;
        const userId = req.user.id;

        const allowedSlots = [
            "Morning (fasting)",
            "After breakfast",
            "After lunch",
            "After dinner"
        ];

        if (value === undefined || value === null || value === "") {
            return res.status(400).json({
                message: "Please enter a glucose value."
            });
        }

        if (!Number.isInteger(value) || value < 40 || value > 600) {
            return res.status(400).json({
                message: "Value must be between 40 and 600 mg/dl."
            });
        }

        if (!reading_date || !time_slot) {
            return res.status(400).json({
                message: "Date and time slot are required."
            });
        }

        if (!allowedSlots.includes(time_slot)) {
            return res.status(400).json({
                message: "Invalid time slot."
            });
        }

        const today = new Date().toLocaleDateString("en-CA");

        if (reading_date > today) {
            return res.status(400).json({
                message: "Date cannot be in the future."
            });
        }

        const countResult = await pool.query(
            `SELECT COUNT(*) FROM glucose_readings
             WHERE user_id = $1 AND reading_date = $2`,
            [userId, reading_date]
        );

        if (Number(countResult.rows[0].count) >= 4) {
            return res.status(400).json({
                message: "You can add only 4 readings per day."
            });
        }

        const result = await pool.query(
            `INSERT INTO glucose_readings
             (user_id, reading_date, time_slot, value)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [userId, reading_date, time_slot, value]
        );

        res.status(201).json({
            message: "Reading added successfully!",
            reading: result.rows[0]
        });

    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                message: `You already have an ${req.body.time_slot} reading for this date.`
            });
        }

        console.error(error.message);

        res.status(500).json({
            message: "Failed to add reading."
        });
    }
};


// Get all readings for the logged-in user
const getReadings = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT * FROM glucose_readings
             WHERE user_id = $1
             ORDER BY reading_date DESC, created_at DESC`,
            [userId]
        );

        res.status(200).json({
            message: "Readings fetched successfully!",
            readings: result.rows
        });

    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            message: "Failed to fetch readings."
        });
    }
};


const updateReading = async (req, res) => {
    try {
        const { reading_date, time_slot, value } = req.body;
        const userId = req.user.id;
        const readingId = req.params.id;

        const allowedSlots = [
            "Morning (fasting)",
            "After breakfast",
            "After lunch",
            "After dinner"
        ];

        if (value === undefined || value === null || value === "") {
            return res.status(400).json({
                message: "Please enter a glucose value."
            });
        }

        if (!Number.isInteger(value) || value < 40 || value > 600) {
            return res.status(400).json({
                message: "Value must be between 40 and 600 mg/dl."
            });
        }

        if (!reading_date || !time_slot) {
            return res.status(400).json({
                message: "Date and time slot are required."
            });
        }

        if (!allowedSlots.includes(time_slot)) {
            return res.status(400).json({
                message: "Invalid time slot."
            });
        }

        const today = new Date().toLocaleDateString("en-CA");

        if (reading_date > today) {
            return res.status(400).json({
                message: "Date cannot be in the future."
            });
        }

        const countResult = await pool.query(
            `SELECT COUNT(*) FROM glucose_readings
             WHERE user_id = $1 AND reading_date = $2
             AND id != $3`,
            [userId, reading_date, readingId]
        );

        if (Number(countResult.rows[0].count) >= 4) {
            return res.status(400).json({
                message: "You can add only 4 readings per day."
            });
        }

        const result = await pool.query(
            `UPDATE glucose_readings
             SET reading_date = $1, time_slot = $2, value = $3
             WHERE id = $4 AND user_id = $5
             RETURNING *`,
            [reading_date, time_slot, value, readingId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Reading not found."
            });
        }

        res.status(200).json({
            message: "Reading updated successfully!",
            reading: result.rows[0]
        });

    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                message: `You already have an ${req.body.time_slot} reading for this date.`
            });
        }

        console.error(error.message);

        res.status(500).json({
            message: "Failed to update reading."
        });
    }
};


const deleteReading = async (req, res) => {
    try {
        const userId = req.user.id;
        const readingId = req.params.id;

        const result = await pool.query(
            `DELETE FROM glucose_readings
             WHERE id = $1 AND user_id = $2
             RETURNING *`,
            [readingId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Reading not found."
            });
        }

        res.status(200).json({
            message: "Reading deleted successfully!"
        });

    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            message: "Failed to delete reading."
        });
    }
};


module.exports = {
    addReading,
    getReadings,
    updateReading,
    deleteReading
};
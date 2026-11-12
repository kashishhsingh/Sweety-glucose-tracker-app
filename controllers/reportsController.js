
const pool = require("../db");

// Get glucose report
const getReport = async (req, res) => {
    try {
        const userId = req.user.id;
        const { type, date, month } = req.query;

        let startDate;
        let endDate;

        if (type === "daily") {
            if (!date) {
                return res.status(400).json({
                    message: "Please provide a date."
                });
            }

            startDate = date;
            endDate = date;

        } else if (type === "month-to-date") {
            if (!date) {
                return res.status(400).json({
                    message: "Please provide a date."
                });
            }

            const selectedDate = new Date(`${date}T00:00:00`);

            if (Number.isNaN(selectedDate.getTime())) {
                return res.status(400).json({
                    message: "Invalid date."
                });
            }

            const year = selectedDate.getFullYear();
            const monthNumber = selectedDate.getMonth();

            startDate = `${year}-${String(monthNumber + 1).padStart(2, "0")}-01`;
            endDate = date;

        } else if (type === "monthly") {
            if (!month || !/^\d{4}-\d{2}$/.test(month)) {
                return res.status(400).json({
                    message: "Please provide a month in YYYY-MM format."
                });
            }

            const [year, monthNumber] = month.split("-").map(Number);

            if (monthNumber < 1 || monthNumber > 12) {
                return res.status(400).json({
                    message: "Invalid month."
                });
            }

            startDate = `${month}-01`;

            const nextMonth = new Date(year, monthNumber, 1);
            endDate = nextMonth.toISOString().slice(0, 10);

            // End date is exclusive for monthly reports
        } else {
            return res.status(400).json({
                message: "Invalid report type."
            });
        }

        const result = await pool.query(
            `SELECT
                MAX(value) AS highest,
                MIN(value) AS lowest,
                ROUND(AVG(value), 1) AS average,
                COUNT(*) AS total_readings
             FROM glucose_readings
             WHERE user_id = $1
             AND reading_date >= $2
             AND reading_date ${type === "monthly" ? "<" : "<="} $3`,
            [userId, startDate, endDate]
        );

        const report = result.rows[0];

        res.status(200).json({
            message: "Report generated successfully!",
            report: {
                highest: report.highest,
                lowest: report.lowest,
                average: report.average,
                total_readings: Number(report.total_readings)
            }
        });

    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            message: "Failed to generate report."
        });
    }
};

module.exports = { getReport };

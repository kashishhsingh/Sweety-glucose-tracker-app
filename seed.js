
require("dotenv").config();

const pool = require("./db");
const bcrypt = require("bcryptjs");

async function seedDatabase() {
  try {
    const demoPassword = "Demo@12345";
    const hashedPassword = await bcrypt.hash(demoPassword, 10);

    const userResult = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       ON CONFLICT (email)
       DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      ["Demo User", "demo@sweety.com", hashedPassword]
    );

    const userId = userResult.rows[0].id;

    const readings = [
      ["Morning (fasting)", 95],
      ["After breakfast", 130],
      ["After lunch", 145],
      ["After dinner", 120]
    ];

    for (const reading of readings) {
      await pool.query(
        `INSERT INTO glucose_readings
         (user_id, reading_date, time_slot, value)
         VALUES ($1, CURRENT_DATE, $2, $3)
         ON CONFLICT (user_id, reading_date, time_slot)
         DO NOTHING`,
        [userId, reading[0], reading[1]]
      );
    }

    console.log("Demo data added successfully!");
    console.log("Email: demo@sweety.com");
    console.log("Password: Demo@12345");
  } catch (error) {
    console.error("Seed error:", error.message);
  } finally {
    await pool.end();
  }
}

seedDatabase();

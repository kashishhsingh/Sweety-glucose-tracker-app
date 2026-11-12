
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function Dashboard({ token, onLogout }) {
  const [readings, setReadings] = useState([]);
  const [readingDate, setReadingDate] = useState(getToday());
  const [timeSlot, setTimeSlot] = useState("Morning (fasting)");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");

  const [report, setReport] = useState(null);
  const [reportType, setReportType] = useState("daily");
  const [reportDate, setReportDate] = useState(getToday());
  const [reportMonth, setReportMonth] = useState(getToday().slice(0, 7));

  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editSlot, setEditSlot] = useState("");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };

  const fetchReadings = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/readings",
        { headers }
      );

      const data = await response.json();

      if (response.ok) {
        setReadings(data.readings);
      } else {
        setMessage(data.message || "Unable to load readings.");
      }
    } catch (error) {
      setMessage("Unable to connect to server.");
    }
  };

  const fetchReport = async () => {
    try {
      let url = `http://localhost:5000/api/reports?type=${reportType}`;

      if (reportType === "monthly") {
        url += `&month=${reportMonth}`;
      } else {
        url += `&date=${reportDate}`;
      }

      const response = await fetch(url, { headers });
      const data = await response.json();

      if (response.ok) {
        setReport(data.report);
      } else {
        setReport(null);
        setMessage(data.message || "Unable to load report.");
      }
    } catch (error) {
      setMessage("Unable to connect to server.");
    }
  };

  useEffect(() => {
    fetchReadings();
  }, []);

  useEffect(() => {
    fetchReport();
  }, [reportType, reportDate, reportMonth]);

  const addReading = async (e) => {
    e.preventDefault();
    setMessage("Saving reading...");

    try {
      const response = await fetch(
        "http://localhost:5000/api/readings",
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            reading_date: readingDate,
            time_slot: timeSlot,
            value: Number(value)
          })
        }
      );

      const data = await response.json();
      setMessage(data.message || "Request completed.");

      if (response.ok) {
        setValue("");
        await fetchReadings();
        await fetchReport();
      }
    } catch (error) {
      setMessage("Unable to connect to server.");
    }
  };

  const startEditing = (reading) => {
    setEditingId(reading.id);
    setEditValue(String(reading.value));
    setEditDate(String(reading.reading_date).slice(0, 10));
    setEditSlot(reading.time_slot);
    setMessage("");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValue("");
    setEditDate("");
    setEditSlot("");
  };

  const editReading = async (e) => {
    e.preventDefault();
    setMessage("Updating reading...");

    try {
      const response = await fetch(
        `http://localhost:5000/api/readings/${editingId}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({
            reading_date: editDate,
            time_slot: editSlot,
            value: Number(editValue)
          })
        }
      );

      const data = await response.json();
      setMessage(data.message || "Request completed.");

      if (response.ok) {
        cancelEditing();
        await fetchReadings();
        await fetchReport();
      }
    } catch (error) {
      setMessage("Unable to connect to server.");
    }
  };

  const deleteReading = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/readings/${id}`,
        {
          method: "DELETE",
          headers
        }
      );

      const data = await response.json();
      setMessage(data.message || "Request completed.");

      if (response.ok) {
        await fetchReadings();
        await fetchReport();
      }
    } catch (error) {
      setMessage("Unable to connect to server.");
    }
  };

  const timeSlots = [
    "Morning (fasting)",
    "After breakfast",
    "After lunch",
    "After dinner"
  ];

  return (
    <div className="tracker-dashboard">
      <header className="dashboard-header">
        <div>
          <h1>🌸 Sweety</h1>
          <p>Your Glucose Tracker</p>
        </div>
        <button onClick={onLogout}>Logout</button>
      </header>

      <main className="dashboard-content">
        <h2>Welcome to your Dashboard!</h2>
        <p>Manage and review your glucose readings.</p>

        {message && <p className="message">{message}</p>}

        <section className="tracker-card">
          <h2>Add Glucose Reading</h2>

          <form onSubmit={addReading}>
            <label>Date</label>
            <input
              type="date"
              value={readingDate}
              max={getToday()}
              onChange={(e) => setReadingDate(e.target.value)}
              required
            />

            <label>Time Slot</label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
            >
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>

            <label>Glucose Value (mg/dl)</label>
            <input
              type="number"
              min="40"
              max="600"
              step="1"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter glucose value"
              required
            />

            <button type="submit">Save Reading</button>
          </form>
        </section>

        <section className="tracker-card">
          <h2>My Readings</h2>

          {readings.length === 0 ? (
            <p>No readings available yet.</p>
          ) : (
            <div className="reading-list">
              {readings.map((reading) => (
                <div className="reading-item" key={reading.id}>
                  <div>
                    <strong>{reading.value} mg/dl</strong>
                    <p>{reading.time_slot}</p>
                    <small>
                      {String(reading.reading_date).slice(0, 10)}
                    </small>
                  </div>

                  <div className="reading-actions">
                    <button onClick={() => startEditing(reading)}>
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => deleteReading(reading.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {editingId !== null && (
          <section className="tracker-card">
            <h2>Edit Glucose Reading</h2>

            <form onSubmit={editReading}>
              <label>Date</label>
              <input
                type="date"
                value={editDate}
                max={getToday()}
                onChange={(e) => setEditDate(e.target.value)}
                required
              />

              <label>Time Slot</label>
              <select
                value={editSlot}
                onChange={(e) => setEditSlot(e.target.value)}
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>

              <label>Glucose Value (mg/dl)</label>
              <input
                type="number"
                min="40"
                max="600"
                step="1"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                required
              />

              <button type="submit">Update Reading</button>
              <button type="button" onClick={cancelEditing}>
                Cancel
              </button>
            </form>
          </section>
        )}

        <section className="tracker-card">
          <h2>Glucose Reports</h2>

          <label>Report Type</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="month-to-date">Month to Date</option>
            <option value="monthly">Monthly</option>
          </select>

          {reportType === "monthly" ? (
            <input
              type="month"
              value={reportMonth}
              onChange={(e) => setReportMonth(e.target.value)}
            />
          ) : (
            <input
              type="date"
              value={reportDate}
              max={getToday()}
              onChange={(e) => setReportDate(e.target.value)}
            />
          )}

          {report && (
            report.total_readings === 0 ? (
              <p>No readings available for this period.</p>
            ) : (
              <div className="report-grid">
                <div className="report-box">
                  <h3>{report.highest ?? "--"}</h3>
                  <p>Highest</p>
                </div>

                <div className="report-box">
                  <h3>{report.lowest ?? "--"}</h3>
                  <p>Lowest</p>
                </div>

                <div className="report-box">
                  <h3>{report.average ?? "--"}</h3>
                  <p>Average</p>
                </div>

                <div className="report-box">
                  <h3>{report.total_readings}</h3>
                  <p>Total Readings</p>
                </div>
              </div>
            )
          )}
        </section>

        <section className="tracker-card">
          <h2>Reading Chart</h2>

          {readings.length === 0 ? (
            <p>Add readings to see your chart.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={[...readings].reverse()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="reading_date"
                  tickFormatter={(date) => String(date).slice(5, 10)}
                />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#e75c91"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;

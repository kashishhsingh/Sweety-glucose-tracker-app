# 🌸 Sweety – Blood Glucose Tracker

## About the Project

Sweety is a full-stack web application that allows users to register, log in, and manage their blood glucose readings.

## Technologies Used

- **Frontend:** React, HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT and bcrypt
- **Charts:** Recharts

## Features

- User registration and login
- Secure password hashing
- JWT-based authentication
- Add, view, edit and delete glucose readings
- Prevent duplicate readings for the same date and time slot
- Daily, Month-to-Date and Monthly reports
- Highest, lowest, average and total reading statistics
- Reading chart
- User-specific reading access

## Project Structure

```text
Sweety-glucose-tracker-app/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── Dashboard.jsx
│   ├── index.html
│   ├── package.json
│   └── package-lock.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── db.js
│   ├── server.js
│   ├── seed.js
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/kashishhsingh/Sweety-glucose-tracker-app.git
cd Sweety-glucose-tracker-app
```

### 2. Backend Setup

Open a terminal and run:

```bash
cd server
npm install
```

Create a `.env` file using `.env.example` and configure your PostgreSQL credentials and JWT secret.

Create the PostgreSQL database and tables using the required schema.

Start the backend:

```bash
npm start
```

### 3. Frontend Setup

Open a second terminal in the project root and run:

```bash
cd client
npm install
npm run dev
```

Open the local URL displayed in the terminal.

## Demo Data

To insert sample data into the database, run this command from the server folder:

```bash
node seed.js
```

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| POST | /api/readings | Add reading |
| GET | /api/readings | View readings |
| PUT | /api/readings/:id | Update reading |
| DELETE | /api/readings/:id | Delete reading |
| GET | /api/reports | Generate reports |

Protected endpoints require a JWT Bearer token.

## Validation Rules

- Glucose value must be a whole number between 40 and 600 mg/dl.
- Only one reading is allowed per time slot per day.
- Maximum four readings per day.
- Future dates are not allowed.

## Learning Outcomes

Through this project, I practised React development, REST API creation, PostgreSQL database integration, authentication, CRUD operations and frontend-backend communication.

## Future Improvements

- Add automated frontend and backend tests.
- Improve reporting and chart visualizations.
- Add pagination for reading history.

## Author

BCA Student | Junior Full Stack Developer Aspirant

## GitHub Repository

https://github.com/kashishhsingh/Sweety-glucose-tracker-app
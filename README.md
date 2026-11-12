# Sweety – Blood Glucose Tracker

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
sweety-glucose-tracker/
├── client/
│   ├── src/
│   └── package.json
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── db.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the Repository
```bash
git clone YOUR_GITHUB_REPOSITORY_LINK
cd sweety-glucose-tracker
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file using `.env.example` and configure your PostgreSQL credentials and JWT secret.

Create the database and tables using the SQL provided in the project.

Start the backend:
```bash
node server.js
```

### 3. Frontend Setup

Open a second terminal:
```bash
cd client
npm install
npm run dev
```

Open the local URL shown in the terminal.

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
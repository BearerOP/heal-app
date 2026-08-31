# Swasthya Backend 🚀

> **Scalable RESTful API & Notification Engine for Swasthya Ecosystem**  
> Built with **Node.js**, **Express.js**, **MongoDB & Mongoose**, **Firebase Admin SDK**, and **JWT Authentication**.

---

## 🌟 Overview

**Swasthya Backend** powers the data management, real-time push notification delivery, care circle networking, and scheduled health alarms for the Swasthya mobile app and web platform.

---

## ✨ Core Features & Micro-Services

### 💊 1. Medication & Refill Alert Service
- **CRUD Operations**: Create, view, update, and delete medication records.
- **Support for Relatives & Care Circle**: Seamlessly add prescriptions for personal use or for connected circle members (`forWhom: 'myself' | 'connection'`).
- **Care Circle Visibility**: Endpoints dynamically query personal medications as well as prescriptions created for/by connected circle members.
- **Real-Time Dose Logging**: Log doses as `taken`, `skipped`, or `not taken yet` with automatic inventory quantity deductions.
- **Refill Alert Intelligence (`GET /medication/refills`)**:
  - Calculates daily dosage burn rate.
  - Projects exact days of supply remaining (`daysRemaining = stock.quantity / dailyDoses`).
  - Categorizes inventory status into `CRITICAL` (≤ 2 days), `LOW_STOCK` (≤ threshold or ≤ 7 days), and `HEALTHY`.
- **Quick Refill Execution (`POST /medication/refill`)**: Restock prescriptions with preset or custom amounts.
- **Date-Filtered Prescriptions (`GET /medication/bydate`)**: Fetches active medications and dose logs for any given calendar date.

---

### 🤝 2. Care Circle & Connection Network
- **User Discovery & Search**: Query users by name, email, or unique alphanumeric `userId` (e.g. `USR12345678`).
- **Connection Lifecycle**:
  - Send connection requests (`POST /connection/request`).
  - View received & sent invitations (`GET /connection/pending`).
  - Accept, decline, or cancel requests (`PUT /connection/update`).
  - View all active connections (`GET /connection/all`).
- **Shared Access Control**: Securely shares medication oversight and vital metrics among trusted family members and caregivers.

---

### 🌙 3. Sleep & Health Vitals Services
- **Sleep Schedule & Logs**: Manage bedtime targets, wake-up alarms, sleep stage logs, and weekly trend metrics.
- **Hydration Logging**: Track fluid intake logs and milestone calculations.
- **Physical Activity & Workouts**: Store steps, calorie burn metrics, and workout routines.

---

### 🔔 4. Push Notifications & Reminders Engine
- **FCM Device Token Sync (`POST /user/fcm-token`)**: Stores and refreshes Firebase Cloud Messaging tokens.
- **Automated Dose Alarms**: Triggers high-priority notifications at scheduled dose times using background cron jobs.
- **Care Circle Notifications**: Sends instant push notifications when connection invitations or emergency alerts occur.

---

### 🔐 5. Security & Authentication
- **JWT Authentication**: Token-based authentication middleware verifying all private routes.
- **Password Encryption**: Secure password hashing with `bcryptjs`.
- **Input Validation**: Robust validation using schema constraints and sanitized request bodies.

---

## 📡 API Endpoints Reference

### Authentication & User
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Register new user account |
| `POST` | `/api/v1/auth/login` | Login user and return JWT token |
| `GET` | `/api/v1/user/profile` | Get current user profile |
| `PUT` | `/api/v1/user/fcm-token` | Update device FCM push notification token |

### Medication & Prescriptions
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/medication/add` | Add medication for self or care circle member |
| `GET` | `/api/v1/medication/all` | Fetch all user & care circle medications |
| `GET` | `/api/v1/medication/bydate` | Fetch medications and dose logs by date |
| `PUT` | `/api/v1/medication/status` | Mark dose status (`taken`, `skipped`) |
| `GET` | `/api/v1/medication/refills` | Get prescription refill alerts and low stock items |
| `POST` | `/api/v1/medication/refill` | Refill medication stock |
| `PUT` | `/api/v1/medication/update` | Update medication details |
| `DELETE`| `/api/v1/medication/delete` | Delete medication record |

### Care Circle Connections
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/connection/all` | Get all active care circle connections |
| `GET` | `/api/v1/connection/pending` | Get pending received and sent invitations |
| `POST` | `/api/v1/connection/request` | Send connection request to a user |
| `PUT` | `/api/v1/connection/update` | Accept or reject connection request |
| `DELETE`| `/api/v1/connection/cancel` | Cancel a sent connection invitation |
| `GET` | `/api/v1/connection/search` | Search users by name, email, or `userId` |

---

## 📂 Project Structure

```
Swasthya-backend/
├── server.js                      # Application entry point & Express server setup
├── package.json                   # Dependencies and scripts
└── src/
    ├── config/                    # Database (db.js) and Firebase configs
    ├── controllers/               # Route controllers (medication, connection, auth, user)
    ├── middleware/                # JWT auth and error handling middlewares
    ├── models/                    # Mongoose schemas (user_model, medication_model, reminder_model)
    ├── routes/                    # API route definitions
    └── services/                  # Business logic services (medication_service, connection_service)
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** >= 18
- **MongoDB** (Local instance or MongoDB Atlas URI)

### Setup & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/360Parminder/Swasthya-v2.0.git
   cd Swasthya/Swasthya-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables (`.env`):**
   ```env
   PORT=5001
   MONGO_URI=mongodb://localhost:27017/swasthya
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start the Development Server:**
   ```bash
   npm start
   # or with nodemon:
   npm run dev
   ```

---

## 📄 License
This project is licensed under the MIT License.

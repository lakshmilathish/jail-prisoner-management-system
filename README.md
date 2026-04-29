# 🏠 Smart Hostel Management & Complaint Automation System

A full-stack MERN application for managing hostel operations — rooms, students, complaints, and maintenance — with role-based access control.

---

## 📁 Project Structure

```
smart-hostel-management/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── complaintController.js
│   │   ├── maintenanceController.js
│   │   ├── roomController.js
│   │   ├── studentController.js
│   │   └── userController.js
│   ├── middleware/auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── Room.js
│   │   ├── Complaint.js
│   │   └── Maintenance.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── complaintRoutes.js
│   │   ├── maintenanceRoutes.js
│   │   ├── roomRoutes.js
│   │   ├── studentRoutes.js
│   │   └── userRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   └── StatusBadge.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── admin/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Rooms.jsx
│   │   │   │   └── Users.jsx
│   │   │   ├── maintenance/
│   │   │   │   └── Dashboard.jsx
│   │   │   ├── student/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── MyComplaints.jsx
│   │   │   │   ├── RoomInfo.jsx
│   │   │   │   └── SubmitComplaint.jsx
│   │   │   └── warden/
│   │   │       ├── Complaints.jsx
│   │   │       └── Dashboard.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

---

## ⚙️ Tech Stack

| Layer      | Technology                                          |
|------------|-----------------------------------------------------|
| Frontend   | React 18 + Vite, TailwindCSS, React Router DOM v6, Axios |
| Backend    | Node.js, Express.js                                 |
| Database   | MongoDB + Mongoose                                  |
| Auth       | JWT (jsonwebtoken) + bcryptjs                       |

---

## 🗄️ MongoDB Collections

| Collection  | Fields                                                              |
|-------------|---------------------------------------------------------------------|
| users       | _id, name, email, password, role, createdAt                        |
| students    | _id, userId, name, roomNumber, contact, createdAt                  |
| rooms       | _id, roomNumber, capacity, status, createdAt                       |
| complaints  | _id, studentId, roomNumber, description, status, createdAt         |
| maintenances| _id, complaintId, staffId, status, updatedAt                       |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

---

### 1. Clone / Download the Project

```bash
git clone <repo-url>
cd smart-hostel-management
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create the `.env` file in `backend/`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-hostel
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

Start the backend server:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The API will run at: **http://localhost:5000**

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will run at: **http://localhost:3000**

> The Vite dev server proxies `/api` requests to `http://localhost:5000` automatically.

---

## 🌿 Environment Variables

**`backend/.env`**

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-hostel
JWT_SECRET=supersecretkey123changeMe
NODE_ENV=development
```

**For MongoDB Atlas**, replace `MONGO_URI` with:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/smart-hostel?retryWrites=true&w=majority
```

---

## 🍃 MongoDB Setup

### Local MongoDB

1. Install MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   ```bash
   # macOS/Linux
   sudo systemctl start mongod
   # or
   mongod --dbpath /data/db

   # Windows
   net start MongoDB
   ```
3. The database `smart-hostel` will be created automatically on first run.

### MongoDB Atlas (Cloud)

1. Go to https://cloud.mongodb.com and create a free account
2. Create a new cluster
3. Under **Database Access**, create a user with read/write access
4. Under **Network Access**, allow your IP (or `0.0.0.0/0` for development)
5. Click **Connect > Connect your application** and copy the connection string
6. Replace `<password>` with your user password and paste into `MONGO_URI`

---

## 👤 Roles & Access

| Role        | Capabilities                                                            |
|-------------|-------------------------------------------------------------------------|
| **student** | Submit complaints, track complaint status, view room info               |
| **warden**  | View all complaints, assign complaints to maintenance staff             |
| **maintenance** | View assigned tasks, update status (Open → In Progress → Resolved) |
| **admin**   | Manage all users (CRUD), manage all rooms (CRUD), view all data         |

---

## 🧪 Testing Different Roles

### Step 1: Register accounts for each role

Go to **http://localhost:3000/register** and create one account for each role:

| Name            | Email                | Password  | Role        |
|-----------------|----------------------|-----------|-------------|
| Admin User      | admin@demo.com       | demo1234  | admin       |
| Warden User     | warden@demo.com      | demo1234  | warden      |
| Maintenance Joe | staff@demo.com       | demo1234  | maintenance |
| Student Alice   | student@demo.com     | demo1234  | student     |

> For student registration, also fill in **Room Number** (e.g., `A-101`) and **Contact**.

### Step 2: Admin — Set up rooms

Log in as `admin@demo.com` → Go to **Manage Rooms** → Add a few rooms (e.g., A-101, A-102, B-201).

### Step 3: Student — Submit a complaint

Log in as `student@demo.com` → Click **Submit Complaint** → Enter room number and description.

### Step 4: Warden — Assign the complaint

Log in as `warden@demo.com` → Go to **All Complaints** → Select maintenance staff from dropdown → Click **Assign**.

### Step 5: Maintenance — Update the task

Log in as `staff@demo.com` → View the assigned task → Click **Mark In Progress**, then **Mark Resolved**.

### Step 6: Student — Track the status

Log in as `student@demo.com` → Go to **My Complaints** → See the updated status.

---

## 📡 API Endpoints

### Auth
| Method | Endpoint            | Access  | Description       |
|--------|---------------------|---------|-------------------|
| POST   | /api/auth/register  | Public  | Register new user |
| POST   | /api/auth/login     | Public  | Login             |
| GET    | /api/auth/me        | Private | Get current user  |

### Complaints
| Method | Endpoint                      | Access              | Description           |
|--------|-------------------------------|---------------------|-----------------------|
| POST   | /api/complaints               | Student             | Submit complaint      |
| GET    | /api/complaints               | Warden, Admin       | Get all complaints    |
| GET    | /api/complaints/mine          | Student             | Get my complaints     |
| PUT    | /api/complaints/:id/status    | Maintenance, Warden | Update status         |
| PUT    | /api/complaints/:id/assign    | Warden, Admin       | Assign to maintenance |

### Rooms
| Method | Endpoint         | Access  | Description    |
|--------|------------------|---------|----------------|
| GET    | /api/rooms       | Private | Get all rooms  |
| POST   | /api/rooms       | Admin   | Create room    |
| PUT    | /api/rooms/:id   | Admin   | Update room    |
| DELETE | /api/rooms/:id   | Admin   | Delete room    |

### Users
| Method | Endpoint                       | Access        | Description          |
|--------|--------------------------------|---------------|----------------------|
| GET    | /api/users                     | Admin         | Get all users        |
| GET    | /api/users/maintenance-staff   | Warden, Admin | Get maintenance staff|
| PUT    | /api/users/:id                 | Admin         | Update user          |
| DELETE | /api/users/:id                 | Admin         | Delete user          |

### Maintenance
| Method | Endpoint              | Access      | Description         |
|--------|-----------------------|-------------|---------------------|
| GET    | /api/maintenance      | Admin, Warden | Get all tasks     |
| GET    | /api/maintenance/mine | Maintenance | Get my tasks        |
| PUT    | /api/maintenance/:id  | Maintenance | Update task status  |

### Students
| Method | Endpoint           | Access        | Description       |
|--------|--------------------|---------------|-------------------|
| GET    | /api/students      | Admin, Warden | Get all students  |
| GET    | /api/students/me   | Student       | Get my profile    |
| PUT    | /api/students/:id  | Admin         | Update student    |
| DELETE | /api/students/:id  | Admin         | Delete student    |

---

## 🎨 UI Features

- Dark theme with deep navy/indigo color scheme
- Role-specific sidebars and dashboards
- Responsive layout (mobile-friendly)
- Real-time status badge updates
- Inline editing for admin tables
- Filter tabs for complaints by status
- Animated loading spinners
- Toast-style success/error messages

---

## 🔒 Security Notes

- Passwords are hashed using bcryptjs (salt rounds: 10)
- JWT tokens expire in 30 days
- All protected routes require `Authorization: Bearer <token>` header
- Role-based middleware enforces access at the API level
- Always change `JWT_SECRET` in production to a strong random string

---

## 📦 Production Build

```bash
# Build frontend
cd frontend
npm run build
# Outputs to frontend/dist/

# Serve with a static server or configure Express to serve the dist folder
```

---

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| `ECONNREFUSED` on backend | Make sure MongoDB is running |
| `401 Unauthorized` | Token expired — log out and log in again |
| Blank page on frontend | Check browser console; ensure backend is running on port 5000 |
| `Room not found` on student room page | Add the room via Admin → Manage Rooms |
| No maintenance staff in dropdown | Register a user with the `maintenance` role first |

# 🛡️ NestOS Authentication Backend

Production-style Node.js / Express / MongoDB authentication API module for **NestOS – Smart Hostel Management System**.

---

## 📌 Features

- **Express MVC Architecture**: Modular structure with controllers, routes, middleware, models, utilities, and seeders.
- **Strict SIET Domain Validation**: Rejects non-institutional emails with `"Please use your official SIET email."` (only `@siet.ac.in` emails allowed).
- **Password Security**: Bcrypt password hashing (`Welcome@123` default seed password). Minimum 8 characters, max 32.
- **JWT Authentication**: Access and Refresh token generation with Bearer authorization protection.
- **Role-Based Access Control (RBAC)**: Support for `Student`, `Warden`, and `Admin` roles.
- **Pre-populated Dataset**: 100 Students, 10 Wardens, and 5 Admins across departments and hostel blocks.
- **Security Hardened**: Protected with Helmet, CORS, Express Rate Limiter, and Morgan logger.

---

## 🏗️ Folder Structure

```
backend/
├── config/
│   └── db.js
├── controllers/
│   └── authController.js
├── middleware/
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   └── validationMiddleware.js
├── models/
│   └── User.js
├── routes/
│   └── authRoutes.js
├── seed/
│   ├── seedData.js
│   └── seeder.js
├── utils/
│   ├── generateTokens.js
│   └── sendResetEmail.js
├── .env
├── .env.example
├── package.json
├── README.md
└── server.js
```

---

## 🚀 Installation & Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Seed the database with 115 users (100 Students, 10 Wardens, 5 Admins):
   ```bash
   npm run seed
   ```

4. Run backend server:
   ```bash
   npm start
   # or development mode with auto-reload:
   npm run dev
   ```

---

## 🔑 Authentication Endpoints

### 1. Login
- **POST** `/api/auth/login`
- **Body**:
  ```json
  {
    "username": "sharanml25@siet.ac.in",
    "password": "Welcome@123"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Login successful",
    "user": {
      "id": "...",
      "name": "Sharan P",
      "username": "sharanml25@siet.ac.in",
      "email": "sharanml25@siet.ac.in",
      "role": "Student",
      "department": "AIML",
      "hostelBlock": "A Block",
      "roomNumber": "304",
      "year": 3
    },
    "token": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi...",
    "role": "Student"
  }
  ```

### 2. Forgot Password
- **POST** `/api/auth/forgot-password`
- **Body**:
  ```json
  {
    "email": "sharanml25@siet.ac.in"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Password reset link has been sent to your registered email."
  }
  ```

### 3. Verify Token / Current User
- **GET** `/api/auth/me`
- **Header**: `Authorization: Bearer <token>`

### 4. Logout
- **POST** `/api/auth/logout`

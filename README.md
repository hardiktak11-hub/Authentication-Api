# 🔐 Authentication API

A production-style Authentication API built with **Node.js, Express.js, MongoDB, and Mongoose**, implementing secure user authentication using **JWT Access Tokens**, **Refresh Tokens**, **HTTP-Only Cookies**, and **bcrypt password hashing**.

The project follows the **MVC (Model-View-Controller)** architecture and demonstrates modern authentication practices commonly used in production backend applications.

---

# 🚀 Features

- ✅ User Registration
- ✅ User Login
- ✅ Secure Password Hashing using bcrypt
- ✅ JWT Access Token Generation
- ✅ JWT Refresh Token Generation
- ✅ Refresh Token Rotation
- ✅ Secure Logout
- ✅ Protected Routes using Authentication Middleware
- ✅ HTTP-Only Cookie Authentication
- ✅ MongoDB Integration
- ✅ Environment Variable Configuration
- ✅ Centralized Error Handling
- ✅ MVC Architecture

---

# 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime Environment |
| Express.js | Backend Framework |
| MongoDB | NoSQL Database |
| Mongoose | MongoDB ODM |
| JWT | Authentication |
| bcrypt | Password Hashing |
| Cookie Parser | Cookie Handling |
| dotenv | Environment Variables |
| Nodemon | Development Server |

---

# 📁 Project Structure

```
Authentication-Api
│
├── config/
│   └── db.js
│
├── controllers/
│   └── auth.controller.js
│
├── middleware/
│   └── auth.middleware.js
│
├── models/
│   └── user.model.js
│
├── routes/
│   └── auth.routes.js
│
├── app.js
├── server.js
├── .env
├── package.json
└── README.md
```

The application follows the **MVC Architecture**, separating business logic, routing, database models, middleware, and configuration for better maintainability and scalability.

---

# 🔐 Authentication Flow

```
User Registers
        │
        ▼
Password is hashed using bcrypt
        │
        ▼
User stored in MongoDB
        │
        ▼
───────────────

User Logs In
        │
        ▼
Password verified using bcrypt
        │
        ▼
Access Token generated
        │
        ▼
Refresh Token generated
        │
        ▼
Refresh Token stored in MongoDB
        │
        ▼
Tokens sent to client
        │
        ▼
───────────────

Protected Route
        │
        ▼
JWT Middleware verifies Access Token
        │
        ▼
Access Granted
```

---

# ⚙️ Getting Started

## 1. Clone Repository

```bash
git clone https://github.com/hardiktak11-hub/Authentication-Api.git
```

---

## 2. Move into Project

```bash
cd Authentication-Api
```

---

## 3. Install Dependencies

```bash
npm install
```

---

## 4. Configure Environment Variables

Create a `.env` file.

```env
PORT=3600

MONGO_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_secret

REFRESH_TOKEN_SECRET=your_refresh_secret

ACCESS_TOKEN_EXPIRY=15m

REFRESH_TOKEN_EXPIRY=7d
```

---

## 5. Start Development Server

```bash
npm run dev
```

Server runs at

```
http://localhost:3600
```

---

# 📌 API Endpoints

## Register User

**POST**

```
/auth/register
```

Body

```json
{
    "username":"john",
    "email":"john@example.com",
    "password":"password123"
}
```

---

## Login User

**POST**

```
/auth/login
```

Body

```json
{
    "email":"john@example.com",
    "password":"password123"
}
```

Response

- Access Token
- Refresh Token
- User Details

---

## Logout User

**POST**

```
/auth/logout
```

Authentication Required

```
Authorization: Bearer <Access Token>
```

The stored Refresh Token is removed from the database and authentication cookies are cleared.

---

## Refresh Access Token

**POST**

```
/auth/refresh-token
```

Uses a valid Refresh Token to generate a new Access Token without requiring the user to log in again.

---

# 🔒 Security Features

### Password Hashing

Passwords are never stored in plain text. Every password is securely hashed using **bcrypt** before being saved to MongoDB.

---

### JWT Authentication

Each authenticated user receives:

- Access Token (Short-lived)
- Refresh Token (Long-lived)

The Access Token is used to access protected resources, while the Refresh Token is used to issue a new Access Token after expiration.

---

### Protected Routes

Authentication middleware verifies the Access Token before allowing access to secured endpoints.

---

### Refresh Token Management

Refresh Tokens are stored in the database and validated before issuing new Access Tokens.

This enables:

- Secure Logout
- Token Revocation
- Better Session Management

---

### HTTP-Only Cookies

Authentication tokens are transmitted using secure HTTP-Only cookies, reducing exposure to client-side JavaScript and helping mitigate XSS attacks.

---

# 📦 Sample Success Response

```json
{
    "success": true,
    "message": "User logged in successfully",
    "data": {
        "user": {
            "_id": "...",
            "username": "john",
            "email": "john@example.com"
        },
        "accessToken": "...",
        "refreshToken": "..."
    }
}
```

---

# 🧠 Concepts Practiced

- JWT Authentication
- Refresh Token Flow
- Access Token Flow
- Password Hashing
- Authentication Middleware
- Protected Routes
- Cookie-Based Authentication
- MongoDB
- Mongoose
- MVC Architecture
- Async/Await
- Error Handling
- Environment Variables

---

# 🚀 Future Improvements

- Email Verification
- Forgot Password
- Password Reset via Email
- Role-Based Authorization (RBAC)
- OAuth (Google / GitHub Login)
- Multi-Factor Authentication (MFA)
- Rate Limiting
- Account Lockout Protection
- Swagger API Documentation
- Docker Support
- Unit & Integration Testing
- Cloud Deployment

---

# 🤝 Contributing

Contributions are welcome.

Feel free to fork the repository, improve it, and submit a pull request.

---

# 👨‍💻 Author

**Hardik Tak**

GitHub:
https://github.com/hardiktak11-hub

---

# ⭐ Support

If you found this project useful or learned something from it, consider giving the repository a **⭐ Star**.

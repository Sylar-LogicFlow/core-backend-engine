# 🚀 Backend API Server

A comprehensive and production-ready RESTful API backend built with Node.js, Express.js, and MongoDB. This project demonstrates professional backend development skills including authentication, authorization, security best practices, and scalable API architecture.

---

## ✨ Features

### Core Functionality
- 🔐 **JWT Authentication & Authorization** - Secure user authentication with token-based system
- 📝 **Complete CRUD Operations** - Full Create, Read, Update, Delete functionality
- 🗄️ **MongoDB Integration** - NoSQL database with Mongoose ODM
- ✅ **Data Validation** - Input validation and sanitization
- 🛡️ **Advanced Error Handling** - Centralized error handling middleware
- 🔒 **Password Encryption** - Secure password hashing with bcrypt
- 📊 **Request Logging** - Morgan middleware for API monitoring

### Security Features
- 🎯 **Custom Middleware** - Authentication and authorization layers
- 🚫 **Rate Limiting** - API request throttling for security
- 🌐 **CORS Configuration** - Cross-Origin Resource Sharing setup
- 🔐 **Security Headers** - Helmet.js for HTTP security headers
- 🛡️ **NoSQL Injection Prevention** - MongoDB sanitization
- ⚡ **XSS Protection** - Cross-site scripting prevention
- 🔒 **HTTP Parameter Pollution Prevention**

### API Features
- 📄 **RESTful Standards** - Following REST API best practices
- 🔄 **Async/Await** - Modern asynchronous JavaScript patterns
- 🍪 **Cookie Support** - Secure cookie-based authentication
- 📝 **Clean Code Structure** - MVC architecture pattern
- 🎨 **Organized Routes** - Modular routing system

---

## 🛠️ Technologies & Tools

### Backend Stack
- **Node.js** - Runtime environment (v14+)
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Security & Authentication
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcrypt** - Password hashing
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **express-mongo-sanitize** - NoSQL injection prevention
- **xss-clean** - XSS attack prevention
- **hpp** - HTTP parameter pollution prevention

### Utilities & Middleware
- **dotenv** - Environment variables management
- **morgan** - HTTP request logger
- **cors** - Cross-origin resource sharing
- **cookie-parser** - Cookie parsing middleware
- **colors** - Terminal string styling
- **nodemon** - Development auto-restart

---

## 📁 Project Structure
```
backend-api-server/
├── ConnectDb/
│   └── CMongodb.js           # MongoDB connection configuration
├── Controller/
│   └── controllers.js        # Business logic and request handlers
├── model/
│   └── Data.js              # Mongoose schemas and models
├── Routes/
│   └── Routes.js            # API route definitions
├── Protection/
│   └── protect.js           # Authentication & authorization middleware
├── node_modules/            # Dependencies (not tracked in git)
├── .env                     # Environment variables (not tracked in git)
├── .gitignore              # Git ignore file
├── package.json            # Project dependencies and scripts
├── package-lock.json       # Locked versions of dependencies
├── server.js               # Application entry point
├── LICENSE                 # License file
└── README.md              # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn**
- **Git**

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/backend-api-server.git

# 2. Navigate to project directory
cd backend-api-server

# 3. Install dependencies
npm install

# 4. Create .env file in root directory
# Copy the contents from .env.example and update with your values

# 5. Start MongoDB (if running locally)
mongod

# 6. Run the application in development mode
npm run dev

# Or run in production mode
npm start
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following variables:
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/your_database_name
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
```

**⚠️ Important:** Never commit the `.env` file to version control!

---

## 📚 API Endpoints

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/register` | Register new user | Public |
| POST | `/api/login` | User login | Public |
| GET | `/api/profile` | Get current user profile | Private |

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/users` | Get all users | Private/Admin |
| GET | `/users/:id` | Get single user | Private/Admin |
| PUT | `/users/:id` | Update user | Private/Admin |
| DELETE | `/users/:id` | Delete user | Private/Admin |

---

## 🔧 API Usage Examples

### Register User
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "Ahmed Mohamed",
  "email": "ahmed@example.com",
  "password": "securePassword123",
  "role": "user"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Ahmed Mohamed",
    "email": "ahmed@example.com",
    "role": "user",
    "createdAt": "2025-11-15T10:30:00.000Z"
  }
}
```

---

### Login User
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "ahmed@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Ahmed Mohamed",
    "email": "ahmed@example.com",
    "role": "user"
  }
}
```

---

### Get Current User (Protected Route)
```bash
GET /api/v1/auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Ahmed Mohamed",
    "email": "ahmed@example.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2025-11-15T10:30:00.000Z"
  }
}
```

---

### Get All Users (Admin Only)
```bash
GET /api/v1/users
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "count": 25,
  "data": [
    {
      "id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "name": "Ahmed Mohamed",
      "email": "ahmed@example.com",
      "role": "user"
    },
    ...
  ]
}
```

---

## 🔐 Authentication Flow

### How Authentication Works

1. **Registration:**
   - User sends name, email, and password
   - Password is hashed with bcrypt
   - User is created in database
   - JWT token is generated and returned

2. **Login:**
   - User sends email and password
   - System verifies credentials
   - JWT token is generated and returned

3. **Protected Routes:**
   - Client sends token in `Authorization` header
   - Server verifies token
   - User data is attached to request
   - Route handler processes request

### Using the Token

Include the token in the `Authorization` header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

Or send it as a cookie (automatic with `cookie-parser`).

---

## 🛡️ Security Features

### Implemented Security Measures

- ✅ **Password Hashing** - bcrypt with salt rounds
- ✅ **JWT Tokens** - Secure token-based authentication
- ✅ **Rate Limiting** - 100 requests per 10 minutes per IP
- ✅ **CORS** - Configured for cross-origin requests
- ✅ **Helmet** - Sets various HTTP security headers
- ✅ **NoSQL Injection Prevention** - Input sanitization
- ✅ **XSS Protection** - Cross-site scripting prevention
- ✅ **HPP Protection** - HTTP parameter pollution prevention
- ✅ **Environment Variables** - Sensitive data protection
- ✅ **HTTPS Ready** - Production-ready security

---

## 📊 Available Scripts
```bash
# Start production server
npm serve

# Start development server with auto-reload
npm run serve

# Run tests (if implemented)
npm test

# Check for code issues
npm run lint

# Format code
npm run format
```

---

## 🎯 Key Learnings & Skills Demonstrated

### Backend Development
- RESTful API design and implementation
- Database modeling and relationships
- Authentication and authorization flows
- Middleware architecture and custom middleware
- Error handling strategies and debugging

### Security Practices
- Password encryption and hashing
- JWT token generation and verification
- Input validation and sanitization
- Rate limiting and DDoS prevention
- Security headers and best practices

### Code Quality
- Clean code organization (MVC pattern)
- Modular and reusable components
- Async/await error handling
- Environment-based configuration
- Professional commenting and documentation

---

## 🌟 Future Enhancements

### Planned Features
- [ ] Role-based access control (RBAC) with multiple roles
- [ ] File upload functionality with Multer and Cloudinary
- [ ] Email verification system with Nodemailer
- [ ] Password reset functionality
- [ ] Refresh token implementation
- [ ] API documentation with Swagger/OpenAPI
- [ ] Unit and integration tests with Jest
- [ ] Docker containerization
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Redis caching layer for improved performance
- [ ] WebSocket integration for real-time features
- [ ] GraphQL endpoint as alternative to REST
- [ ] Microservices architecture
- [ ] Logging with Winston to files
- [ ] API versioning (v2, v3, etc.)
- [ ] Pagination and filtering for large datasets
- [ ] Search functionality across resources

---

## 🧪 Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

---

## 🐳 Docker Support (Coming Soon)
```dockerfile
# Dockerfile example
FROM node:14-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch:**
```bash
   git checkout -b feature/AmazingFeature
```
3. **Commit your changes:**
```bash
   git commit -m '✨ Add some AmazingFeature'
```
4. **Push to the branch:**
```bash
   git push origin feature/AmazingFeature
```
5. **Open a Pull Request**

### Commit Message Guidelines

Use conventional commits:
- `✨ feat:` New feature
- `🐛 fix:` Bug fix
- `📝 docs:` Documentation changes
- `♻️ refactor:` Code refactoring
- `✅ test:` Adding tests
- `🔒 security:` Security improvements

---

## 👨‍💻 Author

**Sylar**
- Email: apdoismail550@gmail.com

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### MIT License Summary
```
MIT License

Copyright (c) 2025 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

---

## 🙏 Acknowledgments

- **Express.js Documentation** - For comprehensive guides
- **MongoDB Documentation** - For database best practices
- **Node.js Community** - For amazing packages and support
- **Stack Overflow** - For problem-solving help
- **GitHub Community** - For open-source inspiration

---

## 📞 Support & Contact

If you have any questions, issues, or suggestions:

- 📧 **Email:** apdoismail550@gmail.com
- 💬 **GitHub Issues:** [Create an issue](https://github.com/yourusername/backend-api-server/issues)
- 💼 **LinkedIn:** [Connect with me](https://linkedin.com/in/yourprofile)

---

## 📈 Project Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/backend-api-server?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/backend-api-server?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/backend-api-server)
![GitHub license](https://img.shields.io/github/license/yourusername/backend-api-server)

---

<div align="center">

### ⭐ If you found this project helpful, please give it a star! ⭐

**Made with ❤️ and ☕ using Node.js, Express.js & MongoDB**

**© 2025 Sylar. All Rights Reserved.**

</div>

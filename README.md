# auth_service
Auth Service for Order Processing Platform that provides user registration and login functionality with JWT token generation.

## Features

- User registration with email and password
- User login with JWT token generation
- Password hashing using bcrypt
- Input validation
- Swagger documentation

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or later recommended)
- npm or yarn
- PostgreSQL database (or any database compatible with Prisma)
- NestJS CLI (optional but recommended)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/lady-thee/auth_service.git
cd auth_service
```

### 2. Install Dependencies

```bash
pnpm install

```

### 3. Environment Configuration

Create a `.env` file in the root directory based on the `.env.example` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=auth"
JWT_SECRET_KEY=your_jwt_secret_key
```

### 4. Database Setup

Run Prisma migrations to set up the database:

```bash
pnpx prisma migrate dev --name init
```

### 5. Start the Application

#### Development Mode

```bash
pnpm run start:dev

```

#### Production Mode

```bash
pnpm run build
pnpm run start:prod

```

## API Endpoints

**BASE_URL** `/api/v1`

The service provides the following endpoints:

### 1. Create User

**Endpoint:** `POST /auth/user/create`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Success Response:**
```json
{
  "status": 201,
  "message": "User successfully created",
  "data": {
    "id": "clxyz...",
    "email": "user@example.com",
    "username": "johndoe1",
    "password": "<hashed-password>",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### 2. User Login

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Success Response:**
```json
{
  "status": 200,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi..."
  }
}
```

## Error Responses

Common error responses include:

- `400 Bad Request`: Invalid email format, missing fields, or invalid credentials
- `400 Bad Request`: User with email already exists
- `500 Internal Server Error`: Server-side errors


## Documentation

API documentation is available via Swagger UI when the application is running:

```
http://localhost:3000/api/v1/docs
```

## Project Structure

```
src/
├── auth/
│   ├── auth.controller.ts        # Controller for auth endpoints
│   ├── auth.service.ts           # Auth service logic
│   ├── dto/
│   │   ├── login.dto.ts          # Login DTO
│   │   └── register.dto.ts       # Registration DTO
├── utils/
│   ├── jwt.utils.ts              # JWT utility functions
│   ├── password.utils.ts         # Password hashing utilities
│   └── response.helpers.ts       # Response helpers
└── app.service.ts               # Prisma service
```

## Dependencies

Key dependencies:

- `@nestjs/common`: Core NestJS framework
- `@nestjs/jwt`: JWT utilities
- `@nestjs/swagger`: API documentation
- `bcrypt`: Password hashing
- `prisma`: Database ORM
- `jwt`: JWT generation and verification
- `@nestjs/microservice`: NestJS Microservice 


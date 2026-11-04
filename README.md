# 🛒 Enterprise Retail & Order Management System

A full-stack retail and order management application built using **ASP.NET Core Web API, Angular, SQL Server, Entity Framework Core, and JWT Authentication**.

RetailFlow provides product and category management, customer shopping, order processing, payment-record tracking, user management, and role-based administration through a layered architecture. Payment records are simulated by the API; no payment provider is integrated.

[![CI/CD](https://github.com/Prasanth-Pali/Enterprise-Retail-Order-Management-System/actions/workflows/ci-cd.yml/badge.svg?branch=master)](https://github.com/Prasanth-Pali/Enterprise-Retail-Order-Management-System/actions/workflows/ci-cd.yml)

---

## 🚀 Features

### 🔐 Authentication & Authorization

* User registration and login
* JWT-based authentication
* Role-based authorization
* Admin and Customer roles
* BCrypt password hashing
* Angular route guards
* HTTP authentication interceptor
* Protected backend APIs
* Automatic role-based dashboard navigation
* Secure logout

### 👨‍💼 Admin Features

* Admin dashboard
* User management
* Deactivate users
* Search and filter users
* Product management
* Add, edit and deactivate products
* Category management
* Add, edit and deactivate categories
* Order management
* Update order status
* Payment history
* Search and filter payments
* Pagination across management screens

### 🛍️ Customer Features

* Customer dashboard
* Browse products
* Search and filter products
* View product details
* Check product availability
* Select product quantity
* Place orders
* Provide shipping address
* Submit a demo payment record
* View order history
* View order details
* View payment information
* Customer profile

### 🏠 Public Homepage

* Product application introduction
* About RetailFlow
* Features overview
* Category information
* Why RetailFlow section
* Login navigation
* Responsive design
* Dark glassmorphism UI

---

## 🔄 Application Workflow

### Customer Flow

```text
Homepage
   ↓
Login
   ↓
Customer Dashboard
   ↓
Products
   ↓
Product Details
   ↓
Place Order
   ↓
Shipping Address
   ↓
Order Created
   ↓
Payment
   ↓
My Orders
   ↓
Order Details
```

### Admin Flow

```text
Login
   ↓
Admin Dashboard
   ├── Users
   ├── Categories
   ├── Products
   ├── Orders
   ├── Payments
   └── Profile
```

---

## 🏗️ Architecture

The backend follows a layered architecture to maintain separation of concerns.

```text
┌─────────────────────────────┐
│       Angular Frontend      │
│                             │
│ Components / Services       │
│ Guards / Interceptors       │
└──────────────┬──────────────┘
               │ HTTP / JSON
               ▼
┌─────────────────────────────┐
│     ASP.NET Core Web API    │
│                             │
│ Controllers                 │
│ DTOs                        │
│ Services                    │
│ Interfaces                  │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       Entity Framework      │
│            Core             │
│                             │
│ DbContext / LINQ            │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│         SQL Server          │
│                             │
│ Users                       │
│ Categories                  │
│ Products                    │
│ Orders                      │
│ OrderItems                  │
│ Payments                    │
└─────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend

* C#
* ASP.NET Core Web API
* .NET
* Entity Framework Core
* SQL Server
* LINQ
* JWT Authentication
* BCrypt
* REST APIs
* Swagger / API Documentation
* Dependency Injection
* Data Annotations

### Frontend

* Angular 22
* TypeScript
* HTML5
* CSS3
* Reactive Forms
* Angular Router
* HttpClient
* Route Guards
* HTTP Interceptors
* Local Storage

### Database

* Microsoft SQL Server
* Entity Framework Core
* EF Core SQL Server data access
* SQL schema and catalog seed script (no EF migrations are currently included)

---

## 🗄️ Database

The application uses the following major tables:

| Table      | Purpose                                |
| ---------- | -------------------------------------- |
| Users      | Stores customer and admin information  |
| Categories | Stores product categories              |
| Products   | Stores product details and inventory   |
| Orders     | Stores customer orders                 |
| OrderItems | Stores products associated with orders |
| Payments   | Stores payment information             |

### Entity Relationship

```text
Users
  │
  │ 1
  │
  │ *
Orders
  │
  │ 1
  │
  │ *
OrderItems
  │
  │ *
  │
  │ 1
Products
  │
  │ *
  │
  │ 1
Categories

Orders
  │
  │ 1
  │
  │ 0..1
Payments
```

---

## 🔒 Security

RetailFlow implements multiple layers of security.

### JWT Authentication

After successful login, the backend generates a JWT containing user information and role claims.

```text
User Login
    ↓
Credentials Verified
    ↓
JWT Generated
    ↓
Token Stored in Browser
    ↓
HTTP Interceptor
    ↓
Authorization: Bearer <token>
    ↓
Protected API
```

### Role-Based Authorization

Admin-only APIs are protected using role authorization.

```csharp
[Authorize(Roles = "admin")]
```

Customer-only APIs use:

```csharp
[Authorize(Roles = "customer")]
```

### Frontend Route Protection

Angular route guards prevent unauthorized users from accessing protected pages.

Examples:

```text
/admin
/users
/categories
/products
/orders
/payments
/profile
```

### Password Security

Passwords are never stored as plain text.

BCrypt is used for password hashing.

The Angular route guard is for navigation only; API authorization is enforced independently by ASP.NET Core. JWTs are stored in browser local storage, so this demo should not be treated as a production authentication design without further security review.

---

## ✅ Validation

Both frontend and backend validation are implemented.

Examples:

* Required fields
* Minimum and maximum string lengths
* Valid email format
* Password validation
* Phone number validation
* Product name validation
* Category name validation
* Product price validation
* Stock quantity validation
* Shipping address validation
* Order quantity validation
* Payment amount validation

Frontend validation provides immediate user feedback, while backend validation protects the API and database from invalid requests.

---

## 📦 Order Management

Customers can create orders by selecting products and quantities.

When an order is created:

1. Customer authentication is verified.
2. Product availability is checked.
3. Product stock is validated.
4. Order items are created.
5. Total amount is calculated.
6. Stock quantity is reduced.
7. Order is created with `Pending` status.

### Order Status Flow

```text
Pending
   ↓
Confirmed
   ↓
Shipped
   ↓
Delivered
```

Orders can also be cancelled according to the implemented business rules.

---

## 💳 Payment Records (Demo Only)

The current API does not charge a card or contact a payment provider. A customer payment request creates a local record marked `Success` and confirms the order after checking the order owner and amount. The transaction ID is generated by the application and is not a provider transaction reference. Do not use this flow for real payments.

The API records:

* Order ID
* Payment method
* Payment amount
* Payment status
* Transaction ID
* Payment date

Admins can view payment history with:

* Pagination
* Search
* Payment status filtering

---

## 🔎 Search, Filtering & Pagination

Management screens support server-side querying capabilities.

Implemented for relevant modules:

* Search
* Filtering
* Status filtering
* Category filtering
* Pagination

Example:

```text
Products
 ├── Search by product name
 ├── Filter by category
 ├── Filter by active status
 └── Pagination

Users
 ├── Search
 ├── Filter by status
 └── Pagination

Payments
 ├── Search
 ├── Filter by payment status
 └── Pagination
```

---

## 🌐 API Endpoints

### Authentication

```text
POST   /api/Auth/register
POST   /api/Auth/login
```

### Users

```text
GET    /api/Users
GET    /api/Users/{id}              # Admin or that user
PUT    /api/Users/{id}              # Admin
PATCH  /api/Users/{id}/deactivate   # Admin
```

### Categories

```text
GET    /api/Categories                  # Admin or customer
GET    /api/Categories/{id}             # Admin or customer
POST   /api/Categories                  # Admin
PUT    /api/Categories/{id}             # Admin
PATCH  /api/Categories/{id}/deactivate  # Admin
```

### Products

```text
GET    /api/Products                  # Admin or customer
GET    /api/Products/{id}             # Admin or customer
POST   /api/Products                  # Admin
PUT    /api/Products/{id}             # Admin
PATCH  /api/Products/{id}/deactivate  # Admin
```

### Orders

```text
GET    /api/Orders                   # Admin or customer's own orders
GET    /api/Orders/{id}              # Admin or order owner
POST   /api/Orders                   # Customer
PATCH  /api/Orders/{id}/status       # Admin
```

### Payments

```text
GET    /api/Payments                   # Admin
GET    /api/Payments/order/{orderId}   # Admin or order owner
POST   /api/Payments                   # Customer; simulated record only
```

---

## 📁 Project Structure

```text
Enterprise-Retail-Order-Management-System
│
├── Enterprise Retail & Order Management System
│   │
│   ├── Controllers/
│   ├── DTOs/
│   │   ├── Categories/
│   │   ├── Orders/
│   │   ├── Payments/
│   │   ├── Products/
│   │   └── Users/
│   ├── Models/
│   ├── Services/
│   │   └── Interfaces/
│   ├── Properties/
│   │   └── launchSettings.json
│   ├── Program.cs
│   ├── Enterprise Retail & Order Management System.csproj
│   ├── appsettings.json
│   └── RetailFlowDB.sql
│
├── enterprise-retail-order-management-ui
│   │
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── account/
│   │   │   │   ├── admin/
│   │   │   │   ├── categories/
│   │   │   │   ├── customer/
│   │   │   │   ├── homepage/
│   │   │   │   ├── login/
│   │   │   │   ├── not-found-component/
│   │   │   │   ├── orders/
│   │   │   │   ├── payments/
│   │   │   │   ├── products/
│   │   │   │   └── users/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   ├── models/
│   │   │   ├── services/
│   │   │   ├── app.config.ts
│   │   │   └── app.routes.ts
│   │   └── environments/
│   ├── proxy.conf.json
│   ├── package.json
│   ├── package-lock.json
│   └── angular.json
│
├── .gitignore
├── README.md
└── Enterprise Retail & Order Management System.slnx
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure the following are installed:

* .NET 10 SDK
* SQL Server
* Node.js 22.22.3+ or 24.15.0+ (required by Angular 22)
* Visual Studio / VS Code

---

### 1. Clone the Repository

```bash
git clone https://github.com/Prasanth-Pali/Enterprise-Retail-Order-Management-System.git
```

```bash
cd Enterprise-Retail-Order-Management-System
```

---

### 2. Configure SQL Server and local secrets

Run `Enterprise Retail & Order Management System/RetailFlowDB.sql` in SQL Server. It creates `RetailFlowDB`, the tables, and sample categories/products. It does not create user accounts or include fixed password hashes. Run this script once for a fresh database.

After starting the API, register an account through the UI or API. Registration currently accepts Gmail addresses and requires a password with uppercase, lowercase, a number, and a special character. To make a local account an admin, update that account directly in your development database:

```sql
UPDATE Users SET Role = 'admin' WHERE Email = 'your-admin-email@gmail.com';
```

From the repository root, set the connection string and a unique JWT signing key using .NET user secrets. Never commit secrets:

```powershell
dotnet user-secrets --project ".\Enterprise Retail & Order Management System\Enterprise Retail & Order Management System.csproj" set "ConnectionStrings:RetailFlowConnection" "Server=.\SQLEXPRESS;Database=RetailFlowDB;Trusted_Connection=True;TrustServerCertificate=True;"
dotnet user-secrets --project ".\Enterprise Retail & Order Management System\Enterprise Retail & Order Management System.csproj" set "Jwt:Key" "<random secret with at least 32 bytes>"
```

The JWT issuer, audience, expiration, and local CORS origin are configured in the backend `appsettings.json`. For deployment, override `Cors:AllowedOrigins` using environment variables such as `Cors__AllowedOrigins__0` and allow only trusted frontend origins.

---

### 3. Run the Backend

From the repository root, run:

```powershell
dotnet run --project ".\Enterprise Retail & Order Management System\Enterprise Retail & Order Management System.csproj" --launch-profile http
```

The HTTP launch profile listens at `http://localhost:5150`; Swagger is at `http://localhost:5150/swagger`. To run from the backend directory instead:

```powershell
Set-Location ".\Enterprise Retail & Order Management System"
dotnet run --launch-profile http
```

The backend targets .NET 10. Its connection string and JWT key must be configured before startup.

After startup, register a user, then optionally promote a local development account to admin using the SQL statement above.

---

### 4. Run the Angular Frontend

Open another terminal:

```bash
cd enterprise-retail-order-management-ui
```

Install the exact dependencies from the lock file and start the dev server:

```bash
npm ci
npm start
```

The app is at `http://localhost:4200`. The Angular dev-server proxy forwards `/api` requests to `http://localhost:5150`; keep the backend running with its HTTP launch profile.

### 5. Build and test

Run the backend build from the repository root and frontend commands from the UI directory:

```bash
dotnet build ".\Enterprise Retail & Order Management System\Enterprise Retail & Order Management System.csproj"
```

```bash
cd enterprise-retail-order-management-ui
npm run build
npm test -- --watch=false
```

The frontend uses Angular 22, TypeScript 6, and Vitest.

### GitHub Actions CI

The [CI/CD workflow](.github/workflows/ci-cd.yml) runs automatically on pushes and pull requests targeting `master`, and can also be started manually from the repository's **Actions** tab. Its backend and frontend jobs run independently:

* **Backend:** restores the .NET solution and builds it in Release configuration.
* **Frontend:** installs dependencies with `npm ci`, builds the Angular app for production, and runs the Vitest suite.

The workflow currently provides continuous integration (build and test checks); automatic deployment is not configured because no hosting target or deployment credentials have been specified.

### Run with Docker

Docker Compose builds the API and Angular frontend images from separate targets in the root-level `Dockerfile`. The API and frontend remain separate containers because they use different runtimes. SQL Server remains external; create the database with the SQL script described above and ensure the API container can reach it.

1. Copy `.env.example` to `.env`, then set `RETAILFLOW_CONNECTION_STRING` to a connection string reachable from Docker and `JWT_KEY` to a random secret of at least 32 bytes. Keep `.env` private; it is excluded from Git.
2. Start both services from the repository root:

```powershell
Copy-Item .env.example .env
# Edit .env and provide the database connection string and JWT key.
docker compose up --build
```

The UI is available at `http://localhost:8080`, and the API at `http://localhost:5150`. Swagger is enabled only in the API's Development environment. The UI's Nginx server forwards `/api` requests to the API container. For a database running on the host machine, configure SQL Server to accept connections from Docker and use a host-reachable address in the connection string (for example, `host.docker.internal` where supported).

When deploying the frontend outside Docker Compose (for example, as a separate Render service), set its `API_UPSTREAM` environment variable to the API service URL, such as `https://your-api-service.onrender.com`. Also set the API service's `Cors__AllowedOrigins__0` to the frontend's public URL. The Compose setup configures its internal API address automatically.

To stop the containers, press Ctrl+C and run `docker compose down`.

---

## 🧪 API Testing

The APIs can be tested using:

* Swagger
* Postman

Recommended testing flow:

```text
Register
   ↓
Login
   ↓
Copy JWT
   ↓
Authorize Swagger / Postman
   ↓
Test Protected APIs
```

Important authorization scenarios:

```text
No Token
   → 401 Unauthorized

Valid Token + Wrong Role
   → 403 Forbidden

Valid Token + Correct Role
   → Successful Response
```

---

## 🎯 Key Concepts Demonstrated

This project demonstrates practical implementation of:

* RESTful API development
* ASP.NET Core Web API
* Angular application development
* Entity Framework Core
* SQL Server
* LINQ
* Dependency Injection
* DTO pattern
* Service layer architecture
* JWT authentication
* Role-based authorization
* BCrypt password hashing
* Angular Route Guards
* HTTP Interceptors
* Reactive Forms
* Client-side and server-side validation
* Search and filtering
* Pagination
* Order management
* Payment management
* API error handling
* Responsive UI design

---

## 👨‍💻 Author

**Prasanth Pali**

Software Engineer | .NET Full Stack Developer

### Technologies

```text
C# | .NET | ASP.NET Core | Angular | TypeScript
SQL Server | EF Core | REST APIs | JWT
HTML | CSS | Git | GitHub
```

---

## 📌 Project Summary

**RetailFlow** is designed as an enterprise-style retail management application demonstrating how a modern full-stack application can be structured with secure authentication, role-based access control, business workflows, database integration, validation, and a responsive Angular frontend.

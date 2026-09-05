# 🛒 Enterprise Retail & Order Management System

A full-stack enterprise-style Retail & Order Management System built using **ASP.NET Core Web API, Angular, SQL Server, Entity Framework Core, JWT Authentication, and BCrypt**.

The application provides role-based management for users, categories, products, orders, inventory, and payments. It follows a layered architecture with separation between **Controllers, Services, DTOs, and Data Access**.

---

## 🚀 Project Overview

**RetailFlow** is designed to simulate a real-world retail management application where administrators can manage the business operations and customers can browse products, place orders, and make payments.

### 👨‍💼 Admin

Admins can:

* Manage users
* Manage categories
* Manage products
* Manage inventory
* View all orders
* Update order status
* View payment transactions
* Search, filter and paginate management data

### 👤 Customer

Customers can:

* Register and login
* Browse active categories
* Browse active products
* Search products
* Place orders
* View their own orders
* Make payments
* Track order status

---

# 🏗️ Architecture

The backend follows a **Layered Architecture**.

```text
                    Angular Client
                         │
                         ▼
                  ASP.NET Core API
                         │
                         ▼
                 Controller Layer
                         │
                         ▼
                   Service Layer
                         │
                         ▼
                    DTO Layer
                         │
                         ▼
                 Entity Framework Core
                         │
                         ▼
                    SQL Server
```

### Controller Layer

Responsible for:

* Receiving HTTP requests
* Request validation
* Authorization
* Calling service methods
* Returning HTTP responses

### Service Layer

Responsible for:

* Business logic
* Validation
* Database operations
* Order processing
* Payment processing
* Stock management
* Transaction handling

### DTO Layer

DTOs are used to:

* Control request and response data
* Avoid exposing database entities directly
* Validate incoming requests
* Improve API maintainability
* Reduce unnecessary data exposure

### Data Layer

**Entity Framework Core Database-First** is used to communicate with SQL Server.

---

# 🛠️ Technology Stack

## Backend

* C#
* ASP.NET Core Web API
* .NET 10
* Entity Framework Core
* LINQ
* JWT Bearer Authentication
* BCrypt.Net
* Data Annotations
* REST APIs
* Swagger / OpenAPI

## Frontend

* Angular
* TypeScript
* HTML5
* CSS3
* Angular Reactive Forms
* Angular HTTP Client
* Angular Route Guards
* HTTP Interceptors
* AG Grid
* Local Storage

## Database

* Microsoft SQL Server
* SQL Server Express
* Entity Framework Core Database-First

## Development & Source Control

* Visual Studio
* Visual Studio Code
* Git
* GitHub

---

# ✨ Key Features

## 🔐 Authentication & Authorization

The application implements JWT-based authentication.

### Authentication Flow

```text
User Registration
       ↓
Password Validation
       ↓
BCrypt Password Hashing
       ↓
User Login
       ↓
Credential Validation
       ↓
JWT Token Generation
       ↓
Token Stored on Client
       ↓
HTTP Interceptor Adds Bearer Token
       ↓
API Validates JWT
       ↓
Role-Based API Access
```

### Supported Roles

```text
Admin
Customer
```

Role-based authorization is implemented using ASP.NET Core authorization attributes.

Example:

```csharp
[Authorize(Roles = "admin")]
```

Customer-specific APIs are protected using authenticated user information from JWT claims.

---

# 🔑 Password Security

Passwords are never stored as plain text.

```text
Plain Password
      ↓
    BCrypt
      ↓
Password Hash
      ↓
SQL Server
```

During login, the supplied password is verified against the stored BCrypt hash.

---

# 👥 User Management

Admin users can manage registered users.

### Features

* Get users
* Get user by ID
* Search users
* Filter by role
* Filter by active status
* Pagination
* Update user information
* Deactivate users

Sensitive fields such as `PasswordHash` are not returned through API responses.

Example:

```http
GET /api/Users?pageNumber=1&pageSize=10
```

Search:

```http
GET /api/Users?search=rahul
```

Role filter:

```http
GET /api/Users?role=customer
```

Status filter:

```http
GET /api/Users?isActive=true
```

---

# 📦 Category Management

Categories are used to organize products.

### Admin Features

* Create category
* View categories
* View category by ID
* Update category
* Deactivate category
* Search categories
* Filter categories
* Pagination

### Customer Access

Customers can view active categories only.

---

# 🛍️ Product Management

The Product module manages product information and inventory.

### Features

* Create products
* View products
* View product by ID
* Update products
* Search products
* Filter by category
* Pagination
* Stock management
* Deactivate products

Example:

```http
GET /api/Products?pageNumber=1&pageSize=10
```

Search:

```http
GET /api/Products?search=Samsung
```

Category filter:

```http
GET /api/Products?categoryId=2
```

### Role-Based Access

**Admin**

* Create products
* Update products
* Deactivate products
* View active and inactive products

**Customer**

* View active products
* Search active products
* Browse available inventory

---

# 📋 Order Management

Orders implement a real-world order processing workflow.

## Order Lifecycle

```text
Pending
   ↓
Confirmed
   ↓
Shipped
   ↓
Delivered
```

Cancellation is supported from applicable stages:

```text
Pending ──────→ Cancelled

Confirmed ────→ Cancelled
```

## Order Creation Flow

When a customer creates an order:

```text
Validate Customer
       ↓
Validate Order Items
       ↓
Validate Products
       ↓
Check Stock
       ↓
Get Current Product Price
       ↓
Create Order
       ↓
Create Order Items
       ↓
Calculate Total
       ↓
Reduce Product Stock
       ↓
Commit Transaction
```

The complete order creation process is executed inside a database transaction.

### Customer

Customers can view only their own orders.

### Admin

Admins can:

* View all orders
* View order details
* Update order status
* Manage the order lifecycle

---

# 💳 Payment Management

The application currently implements a **payment simulation/business workflow** rather than connecting to a real payment provider.

### Supported Payment Methods

* Credit Card
* Debit Card
* UPI
* Net Banking
* Cash on Delivery

### Payment Flow

```text
Customer
   ↓
Create Order
   ↓
Order = Pending
   ↓
Create Payment
   ↓
Validate Order
   ↓
Validate Payment Amount
   ↓
Validate Payment Method
   ↓
Create Payment Record
   ↓
Payment = Success
   ↓
Order = Confirmed
```

Payment creation and order confirmation are handled within a database transaction.

> ⚠️ No real payment gateway such as Razorpay or Stripe is currently integrated.

---

# 🗄️ Database

The application uses:

**Microsoft SQL Server**

Database:

```text
RetailFlowDB
```

## Main Tables

```text
Users
Categories
Products
Orders
OrderItems
Payments
```

## Database Relationships

```text
Users
  │
  ▼
Orders
  │
  ▼
OrderItems
  │
  ▼
Products
  │
  ▼
Categories

Orders
  │
  ▼
Payments
```

The application uses the existing database schema and does not introduce a separate Cart table.

---

# 🔄 Entity Framework Core

The project uses **Entity Framework Core Database-First**.

Database entities and the DbContext are generated from the existing SQL Server database using `Scaffold-DbContext`.

Example:

```powershell
Scaffold-DbContext "Server=.\SQLEXPRESS;Database=RetailFlowDB;Trusted_Connection=True;TrustServerCertificate=True;" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models -Context RetailFlowDbContext -Force
```

This generates:

* Entity classes
* `RetailFlowDbContext`
* Database relationships

---

# 🌐 Angular Frontend

The project includes an Angular-based frontend.

The frontend communicates with the ASP.NET Core Web API through HTTP services.

## Frontend Modules

```text
Login
   │
   ├── Register
   │
   └── Authentication

Admin Dashboard
   │
   ├── Users
   ├── Categories
   ├── Products
   ├── Orders
   └── Payments

Customer
   │
   ├── Products
   ├── Categories
   └── Orders
```

### Angular Features

* Reactive Forms
* HTTP Services
* JWT Authentication
* HTTP Interceptor
* Route Guards
* Role-based navigation
* Local Storage token management
* Search
* Filtering
* Pagination
* Modal-based CRUD operations
* AG Grid
* Responsive dark/glass UI

---

# 🔒 Angular Security Flow

After successful login, the JWT token is stored on the client.

```text
Login API
    ↓
JWT Token
    ↓
localStorage
    ↓
Angular HTTP Interceptor
    ↓
Authorization: Bearer <token>
    ↓
ASP.NET Core API
```

Protected routes are handled using Angular route guards.

Unauthorized users are redirected to the login page.

---

# 🔎 Search, Filtering & Pagination

The application implements server-side search/filtering and pagination for management modules.

Examples include:

* User search
* User role filtering
* User status filtering
* Category search
* Product search
* Product category filtering
* Order filtering
* Payment search
* Payment status filtering

Pagination reduces the amount of data returned from the API and improves application performance.

---

# ✅ Input Validation

ASP.NET Core Data Annotations are used for request validation.

Validation includes:

* Required fields
* Email validation
* String length
* Phone number validation
* Strong password validation
* Numeric range validation
* Order quantity validation
* Shipping address validation
* Product stock validation
* Payment amount validation

### Password Requirements

* Minimum 8 characters
* Uppercase letter
* Lowercase letter
* Number
* Special character

---

# 🔄 Database Transactions

Transactions are used for critical business operations.

For example, order creation performs:

```text
Create Order
     +
Create Order Items
     +
Calculate Total
     +
Reduce Product Stock
     ↓
Commit Transaction
```

If an operation fails, the transaction can roll back the changes.

Payment processing also uses transaction handling while creating the payment and confirming the order.

---

# 📡 API Endpoints

## Authentication

```http
POST /api/Auth/register
POST /api/Auth/login
```

## Users

```http
GET    /api/Users
GET    /api/Users/{id}
PUT    /api/Users/{id}
PATCH  /api/Users/{id}/deactivate
```

## Categories

```http
GET    /api/Categories
GET    /api/Categories/{id}
POST   /api/Categories
PUT    /api/Categories/{id}
PATCH  /api/Categories/{id}/deactivate
```

## Products

```http
GET    /api/Products
GET    /api/Products/{id}
POST   /api/Products
PUT    /api/Products/{id}
PATCH  /api/Products/{id}/deactivate
```

## Orders

```http
POST   /api/Orders
GET    /api/Orders
GET    /api/Orders/{id}
PATCH  /api/Orders/{id}/status
```

## Payments

```http
POST   /api/Payments
GET    /api/Payments
GET    /api/Payments/order/{orderId}
```

---

# 📁 Project Structure

```text
Enterprise-Retail-Order-Management-System
│
├── Enterprise Retail & Order Management System
│   │
│   ├── Controllers
│   │   ├── AuthController.cs
│   │   ├── UsersController.cs
│   │   ├── CategoriesController.cs
│   │   ├── ProductsController.cs
│   │   ├── OrdersController.cs
│   │   └── PaymentsController.cs
│   │
│   ├── DTOs
│   │   ├── Auth
│   │   ├── Users
│   │   ├── Categories
│   │   ├── Products
│   │   ├── Orders
│   │   └── Payments
│   │
│   ├── Models
│   │   ├── User.cs
│   │   ├── Category.cs
│   │   ├── Product.cs
│   │   ├── Order.cs
│   │   ├── OrderItem.cs
│   │   ├── Payment.cs
│   │   └── RetailFlowDbContext.cs
│   │
│   ├── Services
│   │   ├── Interfaces
│   │   ├── AuthService.cs
│   │   ├── UserService.cs
│   │   ├── CategoryService.cs
│   │   ├── ProductService.cs
│   │   ├── OrderService.cs
│   │   └── PaymentService.cs
│   │
│   ├── Program.cs
│   ├── appsettings.json
│   └── *.csproj
│
├── enterprise-retail-order-management-ui
│   │
│   ├── src
│   │   ├── app
│   │   │   ├── components
│   │   │   ├── services
│   │   │   ├── guards
│   │   │   ├── interceptors
│   │   │   └── Models
│   │   └── styles.css
│   │
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
│
├── Enterprise Retail & Order Management System.slnx
├── .gitignore
└── README.md
```

---

# ▶️ How to Run

## 1. Clone Repository

```bash
git clone https://github.com/Prasanth-Pali/Enterprise-Retail-Order-Management-System.git
```

```bash
cd Enterprise-Retail-Order-Management-System
```

---

## 2. Configure SQL Server

Make sure SQL Server Express is installed and running.

Default instance:

```text
.\SQLEXPRESS
```

Create/use:

```text
RetailFlowDB
```

---

## 3. Configure Connection String

Update the backend `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "RetailFlowConnection": "Server=.\\SQLEXPRESS;Database=RetailFlowDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

> For production environments, connection strings and JWT secrets should be stored securely rather than committed to source control.

---

## 4. Run Backend

Navigate to the backend project:

```bash
cd "Enterprise Retail & Order Management System"
```

Restore packages:

```bash
dotnet restore
```

Build:

```bash
dotnet build
```

Run:

```bash
dotnet run
```

The API will start using the configured ASP.NET Core development URL.

---

# 🧪 Swagger / API Testing

After starting the backend, open the Swagger URL shown by ASP.NET Core.

### Recommended Testing Flow

```text
1. Register
      ↓
2. Login
      ↓
3. Copy JWT Token
      ↓
4. Swagger → Authorize
      ↓
5. Test Categories
      ↓
6. Test Products
      ↓
7. Create Order
      ↓
8. Create Payment
      ↓
9. Verify Order
      ↓
10. Verify Payment
```

For Swagger authorization:

```text
Bearer YOUR_JWT_TOKEN
```

---

# ▶️ Run Angular Frontend

Navigate to the Angular project:

```bash
cd enterprise-retail-order-management-ui
```

Install dependencies:

```bash
npm install
```

Start Angular:

```bash
ng serve
```

Open the Angular application in the browser using the URL displayed by Angular CLI.

Make sure the backend API is running before using the frontend.

---

# 🔐 Security Practices

The project implements:

* JWT authentication
* Role-based authorization
* BCrypt password hashing
* DTO-based API design
* Protected API endpoints
* Angular route guards
* HTTP interceptor for JWT
* Input validation
* Active/inactive user management
* PasswordHash exclusion from API responses
* Database constraints
* Transaction handling

---

# 📊 HTTP Status Codes

The API uses standard HTTP status codes.

| Status Code | Meaning                               |
| ----------- | ------------------------------------- |
| 200         | Request completed successfully        |
| 201         | Resource created successfully         |
| 400         | Invalid request / validation failure  |
| 401         | Authentication required / invalid JWT |
| 403         | Insufficient permissions              |
| 404         | Resource not found                    |
| 409         | Resource conflict                     |
| 500         | Internal server error                 |

---

# 🔀 Git Workflow

The project uses Git and GitHub for source control.

Typical workflow:

```bash
git status
git add .
git commit -m "Updated retail management module"
git push origin master
```

---

# 🚧 Future Enhancements

The following features can be added in future iterations:

* Refresh Token
* Global Exception Handling Middleware
* Structured Logging
* Consistent API Response Wrapper
* Real Payment Gateway Integration
* Email Notifications
* Advanced Product Search
* Advanced Sorting and Filtering
* Order Tracking
* Unit Testing
* Integration Testing
* Docker Containerization
* Azure Deployment
* Azure DevOps CI/CD
* Redis Caching
* Message Queues
* API Versioning
* Production-level concurrency handling
* Improved inventory concurrency control

---

# 🎯 Project Highlights

This project demonstrates practical enterprise application development using:

* ASP.NET Core Web API
* RESTful API design
* Layered Architecture
* Service Layer
* DTO-based design
* Dependency Injection
* Entity Framework Core
* Database-First development
* SQL Server
* LINQ
* JWT Authentication
* Role-Based Authorization
* BCrypt Password Hashing
* Angular
* TypeScript
* HTTP Interceptors
* Route Guards
* Search & Filtering
* Server-side Pagination
* Inventory Management
* Order Processing
* Payment Workflow
* Database Transactions
* Input Validation
* Git & GitHub

---

# 📌 Current Project Status

**Status: 🚧 Actively Under Development**

### ✅ Implemented

* JWT Authentication
* User Registration & Login
* Role-Based Authorization
* User Management
* Category Management
* Product Management
* Inventory/Stock Management
* Order Management
* Order Status Workflow
* Payment Simulation
* Angular Frontend
* Angular Route Guards
* JWT HTTP Interceptor
* Search & Filtering
* Pagination
* Modal-based management UI
* SQL Server Database
* EF Core Database-First
* Swagger / OpenAPI

### 🔜 Planned

* Refresh Tokens
* Global Exception Handling
* Structured Logging
* Automated Testing
* Real Payment Gateway
* Docker
* Azure Deployment
* Azure DevOps CI/CD
* Redis
* Message Queues
* API Versioning

---

# 👨‍💻 Author

**PRASANTH PALI**

Software Engineer | .NET Developer

GitHub:
https://github.com/Prasanth-Pali

---

## ⭐ Project

**Enterprise Retail & Order Management System**

Built to demonstrate real-world **.NET Full Stack development, REST API design, SQL Server, Angular, authentication, authorization, business logic, and enterprise application architecture.**

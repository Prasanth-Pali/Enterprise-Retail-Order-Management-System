# Enterprise Retail & Order Management System

A real-time, enterprise-style Retail & Order Management System built using **ASP.NET Core Web API, SQL Server, Entity Framework Core, JWT Authentication, and BCrypt**.

The project is being developed incrementally using a **layered architecture** and real-world backend development practices.

---

## 🚀 Project Status

### Completed

* User Registration & Login
* JWT Authentication
* Role-Based Authorization
* BCrypt Password Hashing
* User Management
* Category Management
* Product Management
* Product Stock Management
* Order Management
* Order Item Management
* Payment Management
* Pagination
* Search & Filtering
* DTO-based API design
* Service Layer Architecture
* Entity Framework Core
* SQL Server Database-First
* Swagger / OpenAPI
* Input Validation
* Transaction Handling
* Customer/Admin access separation
* Order status workflow

### Currently Under Development

* Refresh Token
* Global Exception Handling
* Structured Logging
* Angular Frontend
* Payment Gateway Integration
* Testing
* Docker
* CI/CD
* Azure Deployment

---

# 🛠️ Technologies Used

## Backend

* C#
* ASP.NET Core Web API
* .NET 10
* Entity Framework Core
* LINQ
* JWT Authentication
* BCrypt.Net

## Database

* Microsoft SQL Server
* SQL Server Express
* Entity Framework Core Database-First

## API Documentation

* Swagger / OpenAPI

## Frontend

Planned:

* Angular
* TypeScript
* HTML
* CSS
* AG Grid

## DevOps

Planned:

* Git
* GitHub
* Azure DevOps
* Docker
* CI/CD
* Azure

---

# 🏗️ Architecture

The application follows a layered architecture:

```text
Client
   ↓
Controller Layer
   ↓
Service Layer
   ↓
Entity Framework Core
   ↓
SQL Server
```

### Controller Layer

Responsible for:

* Receiving HTTP requests
* Model validation
* Authorization
* Returning HTTP responses

### Service Layer

Responsible for:

* Business logic
* Validation
* Database operations
* Data processing
* Transaction handling

### DTO Layer

DTOs are used to:

* Control API request/response data
* Avoid exposing database entities directly
* Validate incoming requests
* Improve API security and maintainability

### Data Layer

Entity Framework Core is used to communicate with SQL Server.

---

# 📁 Project Structure

```text
Enterprise Retail & Order Management System
│
├── Controllers
│   ├── AuthController.cs
│   ├── UsersController.cs
│   ├── CategoriesController.cs
│   ├── ProductsController.cs
│   ├── OrdersController.cs
│   └── PaymentsController.cs
│
├── DTOs
│   ├── Auth
│   ├── Users
│   ├── Categories
│   ├── Products
│   ├── Orders
│   └── Payments
│
├── Models
│   ├── User.cs
│   ├── Category.cs
│   ├── Product.cs
│   ├── Order.cs
│   ├── OrderItem.cs
│   ├── Payment.cs
│   └── RetailFlowDbContext.cs
│
├── Services
│   ├── Interfaces
│   │   ├── IAuthService.cs
│   │   ├── IUserService.cs
│   │   ├── ICategoryService.cs
│   │   ├── IProductService.cs
│   │   ├── IOrderService.cs
│   │   └── IPaymentService.cs
│   │
│   ├── AuthService.cs
│   ├── UserService.cs
│   ├── CategoryService.cs
│   ├── ProductService.cs
│   ├── OrderService.cs
│   └── PaymentService.cs
│
├── Program.cs
├── appsettings.json
└── Enterprise Retail & Order Management System.csproj
```

---

# 🔐 Authentication & Authorization

The application uses **JWT Bearer Authentication**.

## Authentication Flow

```text
User Registration
       ↓
Password hashed using BCrypt
       ↓
User Login
       ↓
Credentials validated
       ↓
JWT generated
       ↓
Client sends JWT
       ↓
API validates JWT
       ↓
Authorized API access
```

## Roles

The application supports:

* `admin`
* `customer`

Example:

```csharp
[Authorize(Roles = "admin")]
```

Admin-only APIs are protected using role-based authorization.

Customer APIs are restricted to authenticated customers where required.

---

# 🔑 Password Security

Passwords are never stored as plain text.

BCrypt is used to hash passwords before storing them in SQL Server.

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

# 👤 User Management

The User Management module provides:

* Get users
* Get user by ID
* Search users
* Filter users by role
* Filter users by active status
* Pagination
* Update user
* Deactivate user

### Example

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

Active status:

```http
GET /api/Users?isActive=true
```

Combined:

```http
GET /api/Users?pageNumber=1&pageSize=10&search=rahul&role=customer&isActive=true
```

`PasswordHash` is never returned through API responses.

---

# 📦 Category Management

Categories are used to organize products.

Example categories:

* Electronics
* Mobiles
* Laptops
* Home Appliances

Operations:

* Create category
* Get categories
* Get category by ID
* Update category
* Deactivate category

### Role-based behavior

**Admin:**

* Can manage categories
* Can view active and inactive categories

**Customer:**

* Can view active categories only
* Cannot access inactive categories

---

# 🛍️ Product Management

Product management provides:

* Create product
* Get products
* Get product by ID
* Update product
* Search products
* Filter products by category
* Pagination
* Stock management
* Deactivate product

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

### Role-based behavior

**Admin:**

* Can create products
* Can update products
* Can deactivate products
* Can view active and inactive products

**Customer:**

* Can view active products only
* Cannot access inactive products

---

# 📋 Order Management

Orders follow an enterprise-style order workflow.

## Order Status

```text
Pending
   ↓
Confirmed
   ↓
Shipped
   ↓
Delivered
```

Cancellation is supported from applicable stages.

```text
Pending → Cancelled
Confirmed → Cancelled
```

## Order Creation

When a customer creates an order, the API:

1. Validates the customer
2. Validates order items
3. Validates products
4. Checks product stock
5. Gets the current product price
6. Creates the order
7. Creates order items
8. Calculates total amount
9. Reduces product stock
10. Saves everything inside a database transaction

### Order structure

```text
Order
 ├── Customer
 ├── Order Date
 ├── Shipping Address
 ├── Total Amount
 ├── Status
 │
 └── Order Items
      ├── Product
      ├── Quantity
      ├── Unit Price
      └── Subtotal
```

### Customer access

Customers can view only their own orders.

### Admin access

Admins can view all orders and manage order status.

---

# 💳 Payment Management

The project currently implements a **payment simulation/business workflow** using the existing Payments table.

No real payment gateway is integrated yet.

## Supported Payment Methods

* Credit Card
* Debit Card
* UPI
* Net Banking
* Cash on Delivery

## Payment Statuses

* Pending
* Success
* Failed
* Refunded

## Current Payment Flow

```text
Customer
   ↓
Create Order
   ↓
Order Status = Pending
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
Payment Status = Success
   ↓
Order Status = Confirmed
```

The current implementation simulates successful payment after all business validations pass.

### Important

Actual payment processing through providers such as Razorpay or Stripe is **not implemented yet**.

A future implementation can integrate a real payment gateway with:

* Payment gateway checkout
* Transaction verification
* Webhooks
* Signature verification
* Payment failure handling
* Refund processing

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

### Relationships

```text
Users
  ↓
Orders
  ↓
OrderItems
  ↓
Products
  ↓
Categories

Orders
  ↓
Payments
```

The project currently uses the existing database schema and does not introduce an additional Cart table.

---

# 🔄 Entity Framework Core

The application uses **Entity Framework Core Database-First**.

Database models are generated using `Scaffold-DbContext`.

Example:

```powershell
Scaffold-DbContext "Server=.\SQLEXPRESS;Database=RetailFlowDB;Trusted_Connection=True;TrustServerCertificate=True;" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models -Context RetailFlowDbContext -Force
```

This generates:

* Entity models
* `RetailFlowDbContext`
* Database relationships

---

# ✅ Input Validation

ASP.NET Core Data Annotations are used for request validation.

Validation includes:

* Required fields
* String length
* Email validation
* Phone number validation
* Strong password validation
* Numeric range validation
* Order quantity validation
* Shipping address validation

## Password Requirements

* Minimum 8 characters
* Uppercase letter
* Lowercase letter
* Number
* Special character

---

# 🔒 Security

Implemented security practices include:

* JWT authentication
* Role-based authorization
* BCrypt password hashing
* DTO-based API design
* PasswordHash excluded from responses
* Input validation
* Active/inactive user control
* Database constraints
* Protected API endpoints

---

# 🔄 Transactions

Database transactions are used for critical operations.

For example, order creation performs:

```text
Create Order
     +
Create Order Items
     +
Reduce Product Stock
     +
Calculate Total
```

These operations are executed inside a transaction so that a failure can roll back the operation.

Payment processing also uses a transaction while creating the payment and confirming the order.

---

# 📡 HTTP Status Codes

The API follows standard HTTP status codes.

### 200 OK

Request completed successfully.

### 201 Created

New resource created successfully.

### 400 Bad Request

Invalid request or business validation failure.

### 401 Unauthorized

Authentication is required or JWT is invalid.

### 403 Forbidden

Authenticated user does not have sufficient permissions.

### 404 Not Found

Requested resource does not exist.

### 409 Conflict

Resource conflicts with existing data.

### 500 Internal Server Error

Unexpected server-side error.

---

# ▶️ How to Run

## 1. Clone Repository

```bash
git clone https://github.com/Prasanth-Pali/Enterprise-Retail-Order-Management-System.git
```

## 2. Open the Project

Open the solution using:

* Visual Studio
* Visual Studio Code

## 3. Configure SQL Server

Make sure SQL Server Express is running.

Default instance:

```text
.\SQLEXPRESS
```

## 4. Create Database

Create:

```text
RetailFlowDB
```

Run the project database SQL script.

## 5. Configure Connection String

Update `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "RetailFlowConnection": "Server=.\\SQLEXPRESS;Database=RetailFlowDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

## 6. Restore Packages

```bash
dotnet restore
```

## 7. Build

```bash
dotnet build
```

## 8. Run

```bash
dotnet run
```

## 9. Open Swagger

After starting the application, open the Swagger URL displayed by ASP.NET Core.

Swagger can be used to test the APIs.

---

# 🧪 API Testing Flow

Recommended testing sequence:

### Step 1 — Register

```http
POST /api/Auth/register
```

Register a customer.

### Step 2 — Login

```http
POST /api/Auth/login
```

Get the JWT token.

### Step 3 — Authorize

Use Swagger's **Authorize** button:

```text
Bearer YOUR_TOKEN
```

### Step 4 — Test Categories

```http
GET /api/Categories
```

### Step 5 — Test Products

```http
GET /api/Products
```

### Step 6 — Create Order

```http
POST /api/Orders
```

The order starts with:

```text
Pending
```

### Step 7 — Create Payment

```http
POST /api/Payments
```

After successful payment processing:

```text
Payment = Success
Order = Confirmed
```

### Step 8 — Get Order

```http
GET /api/Orders/{id}
```

### Step 9 — Get Payment

```http
GET /api/Payments/order/{orderId}
```

---

# 🔀 Git Workflow

The project uses Git and GitHub for source control.

Typical workflow:

```bash
git status

git add .

git commit -m "Implemented payment management"

git push origin master
```

---

# 🚀 Future Enhancements

The following features are planned as the project evolves:

* Refresh Token
* Global Exception Handling Middleware
* Structured Logging
* Consistent API Response Model
* Angular Frontend
* AG Grid
* Real Payment Gateway Integration
* Email Notifications
* Advanced Product Search
* Advanced Sorting & Filtering
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

---

# 🎯 Project Goal

The goal of this project is to build an enterprise-style full-stack Retail & Order Management application using real-world software development practices.

The project demonstrates:

* ASP.NET Core Web API
* REST API design
* Layered architecture
* Service Layer
* DTO-based design
* SQL Server
* Entity Framework Core
* Database-First development
* JWT Authentication
* Role-Based Authorization
* BCrypt Password Hashing
* Pagination
* Search & Filtering
* Stock Management
* Order Processing
* Payment Processing
* Database Transactions
* Input Validation
* Git & GitHub

The project is being developed incrementally with a focus on **maintainability, security, scalability, and real-world enterprise development practices**.

---

# 👨‍💻 Author

**PRASANTH PALI**

Software Engineer | .NET Developer

GitHub:

https://github.com/Prasanth-Pali

---

# ⭐ Project Status

🚧 **Actively Under Development**

Core backend modules including **Authentication, User Management, Category Management, Product Management, Order Management, and Payment Management** have been implemented.

The next phase focuses on **refresh tokens, global exception handling, logging, frontend integration, testing, Docker, CI/CD, and Azure deployment**.

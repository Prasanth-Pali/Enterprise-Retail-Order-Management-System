# 🛒 Enterprise Retail & Order Management System

A full-stack retail and order management application built using **ASP.NET Core Web API, Angular, SQL Server, Entity Framework Core, and JWT Authentication**.

RetailFlow provides secure product and category management, customer shopping, order processing, payment tracking, user management, and role-based administration through a layered enterprise-style architecture.

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
* Activate/deactivate users
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
* Make payments
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

* Angular 17
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
* Code First / EF Core data access

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

## 💳 Payment Management

Customers can make payments for their orders.

The payment system records:

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
GET    /api/Users/{id}
PUT    /api/Users/{id}
PATCH  /api/Users/{id}/deactivate
```

### Categories

```text
GET    /api/Categories
GET    /api/Categories/{id}
POST   /api/Categories
PUT    /api/Categories/{id}
PATCH  /api/Categories/{id}/deactivate
```

### Products

```text
GET    /api/Products
GET    /api/Products/{id}
POST   /api/Products
PUT    /api/Products/{id}
PATCH  /api/Products/{id}/deactivate
```

### Orders

```text
GET    /api/Orders
GET    /api/Orders/{id}
POST   /api/Orders
PATCH  /api/Orders/{id}/status
```

### Payments

```text
GET    /api/Payments
GET    /api/Payments/order/{orderId}
POST   /api/Payments
```

---

## 📁 Project Structure

```text
Enterprise-Retail-Order-Management-System
│
├── Enterprise Retail & Order Management System
│   │
│   ├── Controllers
│   ├── DTOs
│   ├── Models
│   ├── Services
│   ├── Interfaces
│   ├── Data
│   ├── Migrations
│   ├── Program.cs
│   └── appsettings.json
│
├── enterprise-retail-order-management-ui
│   │
│   ├── src
│   │   ├── app
│   │   │   ├── components
│   │   │   ├── services
│   │   │   ├── guards
│   │   │   └── interceptors
│   │   └── ...
│   │
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

* .NET SDK
* SQL Server
* SQL Server Management Studio
* Node.js
* Angular CLI
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

### 2. Configure SQL Server

Update the connection string in `appsettings.json`.

Example:

```json
"ConnectionStrings": {
  "RetailFlowConnection": "Server=.\\SQLEXPRESS;Database=RetailFlowDB;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

---

### 3. Run the Backend

Navigate to the backend project:

```bash
cd "Enterprise Retail & Order Management System"
```

Restore dependencies:

```bash
dotnet restore
```

Apply database migrations if required:

```bash
dotnet ef database update
```

Run the API:

```bash
dotnet run
```

The API will start on the configured HTTPS port.

Swagger can then be used to test the APIs.

---

### 4. Run the Angular Frontend

Open another terminal:

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

Open:

```text
http://localhost:4200
```

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

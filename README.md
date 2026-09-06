# 🛒 Enterprise Retail & Order Management System

A full-stack retail and order management application built with **ASP.NET Core Web API, Angular, SQL Server, and Entity Framework Core**.

The system provides separate workflows for **Administrators and Customers**, covering authentication, user management, product and inventory management, order processing, and payment workflows.

---

## 🧰 Tech Stack

### 🔹 Backend

* 💻 C#
* ⚡ ASP.NET Core Web API
* 🟣 .NET
* 🗄️ Entity Framework Core
* 🛢️ SQL Server
* 🔎 LINQ
* 🔐 JWT Bearer Authentication
* 🔒 BCrypt
* 🌐 REST APIs
* 📘 Swagger

### 🔹 Frontend

* 🅰️ Angular
* 📘 TypeScript
* 🌐 HTML5
* 🎨 CSS3
* 📝 Reactive Forms
* 🔗 Angular HTTP Client
* 🛡️ Route Guards
* 🔐 HTTP Interceptors
* 💾 Local Storage

---

## ✨ Features

### 🔐 Authentication & Authorization

* User registration and login
* JWT-based authentication
* Role-based authorization
* Admin and Customer roles
* BCrypt password hashing
* Protected API endpoints
* Angular route guards
* JWT HTTP interceptor

### 👨‍💼 Admin

* 👥 User management
* 🗂️ Category management
* 📦 Product management
* 📊 Inventory and stock management
* 🛒 Order management
* 🔄 Order status updates
* 💳 Payment history
* 🔎 Search and filtering
* 📄 Pagination

### 👤 Customer

* 🛍️ Product browsing
* 🔎 Product search
* 🗂️ Category filtering
* 📋 Product details
* 🛒 Order placement
* 📍 Shipping address management
* 💳 Payment workflow
* 📦 Order history
* 🚚 Order status tracking
* 👤 Account management

---

## 🔄 Order Workflow

```text
👤 Customer
     ↓
🛍️ Browse Products
     ↓
📋 Product Details
     ↓
🛒 Place Order
     ↓
📦 Order Created
     ↓
💳 Payment
     ↓
✅ Order Confirmed
     ↓
🚚 Shipped
     ↓
📬 Delivered
```

### 📌 Order Status

```text
Pending → Confirmed → Shipped → Delivered
   │
   └────────→ Cancelled
```

Order creation validates the customer, products, quantities, stock availability, and product details before creating the order.

---

## 💳 Payment Workflow

The application implements a payment business workflow for demonstration purposes.

### Supported Payment Methods

* 💳 Credit Card
* 💳 Debit Card
* 📱 UPI
* 🏦 Net Banking
* 💵 Cash on Delivery

```text
🛒 Create Order
       ↓
⏳ Pending
       ↓
💳 Create Payment
       ↓
🔍 Validate Order & Amount
       ↓
🧾 Create Payment Record
       ↓
✅ Payment Success
       ↓
📦 Order Confirmed
```

> ⚠️ No external payment gateway is integrated.

---

## 🗄️ Database

The application uses **Microsoft SQL Server** with **Entity Framework Core Database-First**.

### Database

```text
RetailFlowDB
```

### Main Tables

```text
👥 Users
🗂️ Categories
📦 Products
🛒 Orders
📋 OrderItems
💳 Payments
```

---

## 🏗️ Architecture

The backend follows a layered architecture:

```text
🅰️ Angular Client
        ↓
🌐 ASP.NET Core Web API
        ↓
🎮 Controllers
        ↓
⚙️ Services
        ↓
📋 DTOs
        ↓
🔗 Entity Framework Core
        ↓
🗄️ SQL Server
```

### 🎮 Controllers

Handle HTTP requests, authorization, validation, and API responses.

### ⚙️ Services

Contain business logic, validation, order processing, payment processing, stock management, and transaction handling.

### 📋 DTOs

Define API request and response models and separate API contracts from database entities.

### 🔗 Data Access

Entity Framework Core Database-First is used to access SQL Server.

---

## 🔎 Search, Filtering & Pagination

Server-side search, filtering, and pagination are implemented for management modules.

Supported operations include:

* 👥 User search and filtering
* 🗂️ Category search
* 📦 Product search and category filtering
* 🛒 Order filtering
* 💳 Payment search and status filtering
* 📄 Pagination

---

## 🌐 API Endpoints

### 🔐 Authentication

```text
POST /api/Auth/register
POST /api/Auth/login
```

### 👥 Users

```text
GET    /api/Users
GET    /api/Users/{id}
PUT    /api/Users/{id}
PATCH  /api/Users/{id}/deactivate
```

### 🗂️ Categories

```text
GET    /api/Categories
GET    /api/Categories/{id}
POST   /api/Categories
PUT    /api/Categories/{id}
PATCH  /api/Categories/{id}/deactivate
```

### 📦 Products

```text
GET    /api/Products
GET    /api/Products/{id}
POST   /api/Products
PUT    /api/Products/{id}
PATCH  /api/Products/{id}/deactivate
```

### 🛒 Orders

```text
POST   /api/Orders
GET    /api/Orders
GET    /api/Orders/{id}
PATCH  /api/Orders/{id}/status
```

### 💳 Payments

```text
POST   /api/Payments
GET    /api/Payments
GET    /api/Payments/order/{orderId}
```

---

## 📁 Project Structure

```text
Enterprise-Retail-Order-Management-System
│
├── 📂 Enterprise Retail & Order Management System
│   ├── 📂 Controllers
│   ├── 📂 DTOs
│   ├── 📂 Models
│   ├── 📂 Services
│   │   └── 📂 Interfaces
│   ├── 📄 Program.cs
│   ├── 📄 appsettings.json
│   └── 📄 *.csproj
│
├── 📂 enterprise-retail-order-management-ui
│   ├── 📂 src
│   │   └── 📂 app
│   │       ├── 📂 components
│   │       ├── 📂 services
│   │       ├── 📂 guards
│   │       ├── 📂 interceptors
│   │       └── 📂 Models
│   ├── 📄 angular.json
│   ├── 📄 package.json
│   └── 📄 tsconfig.json
│
├── 📄 Enterprise Retail & Order Management System.slnx
├── 📄 .gitignore
└── 📄 README.md
```

---

## 🚀 Getting Started

### 📋 Prerequisites

* 🟣 .NET SDK
* 🟢 Node.js
* 📦 npm
* 🅰️ Angular CLI
* 🗄️ SQL Server Express
* 💻 Visual Studio or Visual Studio Code

### 📥 Clone Repository

```bash
git clone https://github.com/Prasanth-Pali/Enterprise-Retail-Order-Management-System.git

cd Enterprise-Retail-Order-Management-System
```

### 🗄️ Configure SQL Server

Make sure SQL Server Express is running.

Default instance:

```text
.\SQLEXPRESS
```

Database:

```text
RetailFlowDB
```

Configure the connection string in the backend `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "RetailFlowConnection": "Server=.\\SQLEXPRESS;Database=RetailFlowDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

### ▶️ Run Backend

```bash
cd "Enterprise Retail & Order Management System"

dotnet restore
dotnet build
dotnet run
```

### ▶️ Run Angular Frontend

Open a new terminal:

```bash
cd enterprise-retail-order-management-ui

npm install
ng serve
```

Open the URL displayed by Angular CLI.

Make sure the backend API is running before using the frontend.

---

## 🧪 API Testing

Swagger is available when the backend is running.

### 🔐 Authentication Flow

```text
📝 Register
   ↓
🔑 Login
   ↓
🎟️ Get JWT Token
   ↓
📘 Swagger → Authorize
   ↓
🧪 Test Protected APIs
```

Use:

```text
Bearer YOUR_JWT_TOKEN
```

---

## 🛡️ Security

* 🔐 JWT authentication
* 👮 Role-based authorization
* 🔒 BCrypt password hashing
* 🛡️ Protected API endpoints
* 🚧 Angular route guards
* 🔑 JWT HTTP interceptor
* ✅ Input validation
* 📋 DTO-based API design
* 🔒 Password hash excluded from API responses
* 🔄 Database transactions
* 👤 Active/inactive user management

---

## 👨‍💻 Author

**Prasanth Pali**

💼 Software Engineer | .NET Developer

🐙 GitHub: https://github.com/Prasanth-Pali

🛒 Enterprise Retail & Order Management System

A full-stack retail and order management application built using ASP.NET Core Web API, Angular, SQL Server, and JWT Authentication.

The application provides secure product management, customer shopping, order processing, payment tracking, and admin operations following a layered and enterprise-style architecture.

🚀 Features
🔐 Authentication & Authorization
🔑 User registration and login
🪪 JWT-based authentication
👤 Role-based authorization
🛡️ Admin and Customer access control
🔒 BCrypt password hashing
📦 Product Management
➕ Create products
✏️ Update products
🗑️ Delete products
🔍 Search products
🗂️ Filter by category
📄 Pagination
📋 Order Management
🛍️ Place orders
📦 Order and order-item management
🚚 Order status tracking
❌ Order cancellation
📊 Admin order management
💳 Payment Management
💰 Payment tracking
💳 Multiple payment methods
🔄 Payment status management
🧾 Order-payment relationship
👥 User Management
👤 User management
🔍 Search and filtering
📄 Pagination
🛡️ Role-based access
🏗️ Architecture

The backend follows a layered architecture to maintain separation of concerns and make the application easier to maintain and extend.

┌──────────────────────────────┐
│        Angular Frontend      │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│     ASP.NET Core Web API     │
├──────────────────────────────┤
│         Controllers          │
│              ↓               │
│           Services           │
│              ↓               │
│       EF Core / DbContext    │
│              ↓               │
│         SQL Server           │
└──────────────────────────────┘
📂 Backend Structure
Enterprise-Retail-Order-Management-System
│
├── Controllers
├── Services
├── Interfaces
├── DTOs
├── Models
├── Data
├── Migrations
├── Program.cs
└── appsettings.json
🛠️ Technology Stack
Technology	Usage
⚙️ ASP.NET Core Web API	Backend REST APIs
💻 C#	Backend development
🗄️ SQL Server	Database
🔗 Entity Framework Core	Data access
🔐 JWT	Authentication
🔒 BCrypt	Password hashing
📘 Swagger	API documentation & testing
🅰️ Angular	Frontend
📊 AG Grid	Data tables
🌐 REST API	Client-server communication
🔑 Authentication Flow
        👤 User
           │
           ▼
       🔐 Login
           │
           ▼
  ASP.NET Core API
           │
           ▼
      🪪 JWT Token
           │
           ▼
     🖥️ Angular
           │
           ▼
 🔒 Authorized API Requests

Protected APIs use JWT authentication and role-based authorization.

🔄 Order Flow
        👤 Customer
             │
             ▼
      🛍️ Browse Products
             │
             ▼
          💳 Checkout
             │
             ▼
        📋 Create Order
             │
             ▼
         💰 Payment
             │
             ▼
      📦 Order Processing
             │
             ▼
         🚚 Delivery
📄 API Capabilities

The application exposes RESTful APIs for:

🔐 Authentication
👤 Users
📦 Products
🗂️ Categories
📋 Orders
💳 Payments

Swagger is used to explore and test the APIs during development.

🧪 Testing

APIs can be tested using:

📘 Swagger UI
📮 Postman
Example APIs
GET /api/products

GET /api/products?pageNumber=1&pageSize=10

GET /api/products?search=phone
⚙️ Getting Started
1️⃣ Clone the repository
git clone https://github.com/Prasanth-Pali/Enterprise-Retail-Order-Management-System.git
2️⃣ Configure SQL Server

Update the connection string in:

appsettings.json
3️⃣ Configure JWT

Configure the required JWT settings:

Issuer
Audience
Key
4️⃣ Restore dependencies
dotnet restore
5️⃣ Run the application
dotnet run
6️⃣ Open Swagger

After starting the API, open the Swagger URL shown by the application and test the available endpoints.

📌 Future Enhancements

The project can be further enhanced with:

🔄 Refresh Token
🛡️ Global Exception Handling
📝 Structured Logging with Serilog
🚦 API Rate Limiting
⚡ Redis Caching
🧪 Unit & Integration Testing
📦 Docker
🔁 CI/CD Pipeline
📡 SignalR Notifications
📨 Message Queue Integration
☁️ Azure Deployment
👨‍💻 Developer
Prasanth Pali

💼 .NET / Full Stack Developer

C# · ASP.NET Core · Angular · SQL Server · EF Core

⭐ Project

If you find this project useful, feel free to ⭐ the repository.

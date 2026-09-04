# Enterprise Retail & Order Management System

A real-time enterprise-style Retail & Order Management System built using ASP.NET Core Web API, SQL Server and Entity Framework Core.

The application provides secure authentication, role-based authorization, user management, product and category management, cart management, order processing and payment management.

---

## 🚀 Features

- User Registration and Login
- JWT Authentication
- Role-Based Authorization
- BCrypt Password Hashing
- User Management
- Category Management
- Product Management
- Cart Management
- Order Management
- Payment Management
- Pagination
- Search and Filtering
- DTO-based API design
- Service Layer Architecture
- Entity Framework Core
- SQL Server Database
- Swagger API Documentation
- Input Validation
- Secure API Endpoints

---

## 🛠️ Technologies Used

### Backend
- C#
- ASP.NET Core Web API
- .NET 10
- Entity Framework Core
- LINQ
- JWT Authentication
- BCrypt.Net

### Database
- Microsoft SQL Server
- SQL Server Express
- Entity Framework Core Database-First

### API Documentation
- Swagger / OpenAPI

### Frontend
- Angular
- TypeScript
- HTML
- CSS
- AG Grid

### DevOps
- Git
- GitHub
- Azure DevOps
- CI/CD
- Docker

---

## 🏗️ Architecture

The application follows a layered architecture:

Controller → Service → Entity Framework Core → SQL Server

### Controller Layer

Responsible for:

- Receiving HTTP requests
- Model validation
- Returning HTTP responses
- Authorization

### Service Layer

Responsible for:

- Business logic
- Database operations
- Validation logic
- Data processing

### DTO Layer

Used to control the data exposed through APIs and prevent direct exposure of database entities.

### Data Layer

Entity Framework Core is used to communicate with SQL Server.

---

## 📁 Project Structure

Enterprise Retail & Order Management System

├── Controllers
│   ├── AuthController.cs
│   ├── UsersController.cs
│   ├── CategoriesController.cs
│   ├── ProductsController.cs
│   ├── CartController.cs
│   ├── OrdersController.cs
│   └── PaymentsController.cs
│
├── DTOs
│   ├── Auth
│   ├── Users
│   ├── Categories
│   ├── Products
│   ├── Cart
│   ├── Orders
│   └── Payments
│
├── Models
│   ├── User.cs
│   ├── Category.cs
│   ├── Product.cs
│   ├── Cart.cs
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
│   │   ├── ICartService.cs
│   │   ├── IOrderService.cs
│   │   └── IPaymentService.cs
│   │
│   ├── AuthService.cs
│   ├── UserService.cs
│   ├── CategoryService.cs
│   ├── ProductService.cs
│   ├── CartService.cs
│   ├── OrderService.cs
│   └── PaymentService.cs
│
├── Program.cs
├── appsettings.json
└── Enterprise Retail & Order Management System.csproj

---

## 🔐 Authentication & Authorization

The application uses JWT Bearer Authentication.

### Authentication Flow

1. User registers using the Register API.
2. Password is securely hashed using BCrypt.
3. User logs in using email and password.
4. API validates the credentials.
5. JWT token is generated.
6. Client sends the JWT token with subsequent requests.
7. API validates the token before allowing access.

### Roles

The application supports:

- admin
- customer

Example:

[Authorize(Roles = "admin")]

Only authenticated admin users can access admin-level APIs.

---

## 👤 User Management

User management provides enterprise-style operations such as:

- Get users
- Get user by ID
- Search users
- Filter users by role
- Filter users by active status
- Pagination
- Update user
- Deactivate user

### Get Users

GET:

/api/Users

Optional query parameters:

/api/Users?pageNumber=1&pageSize=10

/api/Users?search=rahul

/api/Users?role=customer

/api/Users?isActive=true

Combined:

/api/Users?pageNumber=1&pageSize=10&search=rahul&role=customer&isActive=true

The API returns:

- User data
- Total record count
- Page number
- Page size

PasswordHash is never returned to the client.

---

## 📦 Category Management

Categories are used to organize products.

Example categories:

- Electronics
- Mobiles
- Laptops
- Home Appliances

Operations include:

- Create category
- Get categories
- Get category by ID
- Update category
- Deactivate category

---

## 🛍️ Product Management

Product management provides:

- Create product
- Get products
- Get product by ID
- Update product
- Search products
- Filter products by category
- Pagination
- Stock management
- Activate/deactivate product

Example:

GET:

/api/Products?pageNumber=1&pageSize=10

Search:

/api/Products?search=Samsung

Category filter:

/api/Products?categoryId=2

---

## 🛒 Cart Management

Customers can manage products in their shopping cart.

Operations include:

- Add product to cart
- Get cart
- Update quantity
- Remove product
- Clear cart

Cart maintains:

- User
- Product
- Quantity

A unique constraint is maintained for User + Product to avoid duplicate cart records.

---

## 📋 Order Management

Order processing follows an enterprise-style workflow.

Order statuses:

- Pending
- Confirmed
- Shipped
- Delivered
- Cancelled

Order contains:

- Customer
- Order date
- Shipping address
- Total amount
- Order items
- Product
- Quantity
- Unit price
- Subtotal

Example order flow:

Customer → Cart → Order → Payment → Order Confirmation → Shipment → Delivery

---

## 💳 Payment Management

Payment module maintains payment information for orders.

Supported payment methods:

- Credit Card
- Debit Card
- UPI
- Net Banking
- Cash on Delivery

Payment statuses:

- Pending
- Success
- Failed
- Refunded

Payment contains:

- Order
- Payment method
- Payment status
- Transaction ID
- Payment date
- Amount

---

## 🗄️ Database

The application uses Microsoft SQL Server.

Database name:

RetailFlowDB

Main tables:

- Users
- Categories
- Products
- Cart
- Orders
- OrderItems
- Payments

### Relationships

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

Users
↓
Cart
↓
Products

---

## 🔄 Entity Framework Core

The project uses Entity Framework Core with Database-First approach.

The database models are generated using:

Scaffold-DbContext

Example:

Scaffold-DbContext "Server=.\SQLEXPRESS;Database=RetailFlowDB;Trusted_Connection=True;TrustServerCertificate=True;" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models -Context RetailFlowDbContext -Force

---

## ✅ Validation

The application uses ASP.NET Core Data Annotations for request validation.

Examples:

- Required fields
- String length validation
- Email validation
- Phone number validation
- Strong password validation
- Numeric range validation

Example password requirements:

- Minimum 8 characters
- Uppercase letter
- Lowercase letter
- Number
- Special character

---

## 🔒 Security

Security practices implemented include:

- JWT authentication
- Role-based authorization
- BCrypt password hashing
- PasswordHash never returned in API responses
- HTTPS
- DTO-based request/response handling
- Database constraints
- Input validation
- Active/inactive user control

---

## 📡 HTTP Status Codes

The APIs follow standard HTTP status codes.

### 200 OK

Request completed successfully.

### 201 Created

New resource created successfully.

### 400 Bad Request

Invalid request or validation failure.

### 401 Unauthorized

Authentication required or invalid JWT token.

### 403 Forbidden

Authenticated user does not have sufficient permissions.

### 404 Not Found

Requested resource does not exist.

### 409 Conflict

Resource conflicts with existing data.

### 500 Internal Server Error

Unexpected server-side error.

---

## ▶️ How to Run

### 1. Clone the Repository

git clone https://github.com/Prasanth-Pali/Enterprise-Retail-Order-Management-System.git

### 2. Open the Project

Open the solution using:

- Visual Studio
- Visual Studio Code

### 3. Configure SQL Server

Make sure SQL Server Express is running.

Default instance:

.\SQLEXPRESS

### 4. Create Database

Create:

RetailFlowDB

Run the provided SQL database script.

### 5. Configure Connection String

Update appsettings.json:

Server=.\SQLEXPRESS;Database=RetailFlowDB;Trusted_Connection=True;TrustServerCertificate=True;

### 6. Restore Packages

dotnet restore

### 7. Build Project

dotnet build

### 8. Run Application

dotnet run

### 9. Open Swagger

After starting the application, open the Swagger URL displayed by ASP.NET Core.

Swagger can be used to test all APIs.

---

## 🧪 API Testing Flow

Recommended testing sequence:

### Step 1

Register a customer.

POST:

/api/Auth/register

### Step 2

Login.

POST:

/api/Auth/login

### Step 3

Copy the JWT token.

### Step 4

Authorize Swagger using:

Bearer YOUR_TOKEN

### Step 5

Access authorized APIs.

For example:

GET /api/Users

GET /api/Products

GET /api/Orders

---

## 🔄 Git Workflow

The project uses Git for source control.

Typical workflow:

git status

git add .

git commit -m "Implemented user management APIs"

git push origin master

---

## 🚀 Future Enhancements

Planned enhancements include:

- Angular frontend
- AG Grid integration
- Global exception handling middleware
- Structured logging
- Refresh token implementation
- Email notifications
- Advanced product search
- Sorting and filtering
- Order tracking
- Payment gateway integration
- Docker containerization
- Azure deployment
- Azure DevOps CI/CD pipeline
- Unit testing
- Integration testing
- Redis caching
- Message queues
- API versioning

---

## 🎯 Project Goal

The goal of this project is to build an enterprise-style full-stack Retail & Order Management application following real-world software development practices.

The project demonstrates:

- ASP.NET Core Web API development
- Clean layered architecture
- REST API design
- SQL Server
- Entity Framework Core
- Database-First development
- JWT authentication
- Role-based authorization
- Secure password hashing
- DTOs
- Service layer
- Pagination
- Search and filtering
- Git and GitHub
- Angular integration
- CI/CD and cloud deployment concepts

---

## 👨‍💻 Author

PRASANTH PALI

Software Engineer | .NET Developer

GitHub:

https://github.com/Prasanth-Pali

---

## ⭐ Project Status

🚧 Actively under development

The backend APIs are being developed incrementally following enterprise-style architecture and real-world development practices.

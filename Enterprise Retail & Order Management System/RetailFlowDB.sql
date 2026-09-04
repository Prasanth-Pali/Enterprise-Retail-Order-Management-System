-- =============================================
-- RETAIL & ORDER MANAGEMENT SYSTEM
-- SQL SERVER DATABASE
-- =============================================

-- Create Database
CREATE DATABASE RetailFlowDB;
GO

USE RetailFlowDB;
GO


-- =============================================
-- 1. USERS TABLE
-- =============================================

CREATE TABLE Users
(
    UserId INT IDENTITY(1,1) PRIMARY KEY,

    FullName NVARCHAR(100) NOT NULL,

    Email NVARCHAR(150) NOT NULL UNIQUE,

    PasswordHash NVARCHAR(500) NOT NULL,

    Role NVARCHAR(30) NOT NULL
        CONSTRAINT CK_Users_Role
        CHECK (Role IN ('admin', 'customer')),

    PhoneNumber NVARCHAR(20),

    Address NVARCHAR(250),

    IsActive BIT NOT NULL DEFAULT 1,

    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO


-- =============================================
-- 2. CATEGORIES TABLE
-- =============================================

CREATE TABLE Categories
(
    CategoryId INT IDENTITY(1,1) PRIMARY KEY,

    CategoryName NVARCHAR(100) NOT NULL UNIQUE,

    Description NVARCHAR(500),

    IsActive BIT NOT NULL DEFAULT 1,

    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO


-- =============================================
-- 3. PRODUCTS TABLE
-- =============================================

CREATE TABLE Products
(
    ProductId INT IDENTITY(1,1) PRIMARY KEY,

    ProductName NVARCHAR(150) NOT NULL,

    Description NVARCHAR(500),

    Price DECIMAL(18,2) NOT NULL
        CHECK (Price >= 0),

    StockQuantity INT NOT NULL
        CHECK (StockQuantity >= 0),

    CategoryId INT NOT NULL,

    IsActive BIT NOT NULL DEFAULT 1,

    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),

    UpdatedAt DATETIME2 NULL,

    CONSTRAINT FK_Products_Categories
        FOREIGN KEY (CategoryId)
        REFERENCES Categories(CategoryId)
);
GO


-- =============================================
-- 4. ORDERS TABLE
-- =============================================

CREATE TABLE Orders
(
    OrderId INT IDENTITY(1,1) PRIMARY KEY,

    UserId INT NOT NULL,

    OrderDate DATETIME2 NOT NULL DEFAULT GETDATE(),

    TotalAmount DECIMAL(18,2) NOT NULL
        CHECK (TotalAmount >= 0),

    Status NVARCHAR(30) NOT NULL DEFAULT 'Pending'
        CONSTRAINT CK_Orders_Status
        CHECK
        (
            Status IN
            (
                'Pending',
                'Confirmed',
                'Shipped',
                'Delivered',
                'Cancelled'
            )
        ),

    ShippingAddress NVARCHAR(250),

    CONSTRAINT FK_Orders_Users
        FOREIGN KEY (UserId)
        REFERENCES Users(UserId)
);
GO


-- =============================================
-- 5. ORDER ITEMS TABLE
-- =============================================

CREATE TABLE OrderItems
(
    OrderItemId INT IDENTITY(1,1) PRIMARY KEY,

    OrderId INT NOT NULL,

    ProductId INT NOT NULL,

    Quantity INT NOT NULL
        CHECK (Quantity > 0),

    UnitPrice DECIMAL(18,2) NOT NULL
        CHECK (UnitPrice >= 0),

    SubTotal AS (Quantity * UnitPrice) PERSISTED,

    CONSTRAINT FK_OrderItems_Orders
        FOREIGN KEY (OrderId)
        REFERENCES Orders(OrderId),

    CONSTRAINT FK_OrderItems_Products
        FOREIGN KEY (ProductId)
        REFERENCES Products(ProductId)
);
GO


-- =============================================
-- 6. PAYMENTS TABLE
-- =============================================

CREATE TABLE Payments
(
    PaymentId INT IDENTITY(1,1) PRIMARY KEY,

    OrderId INT NOT NULL UNIQUE,

    PaymentMethod NVARCHAR(30) NOT NULL
        CONSTRAINT CK_Payments_Method
        CHECK
        (
            PaymentMethod IN
            (
                'CreditCard',
                'DebitCard',
                'UPI',
                'NetBanking',
                'CashOnDelivery'
            )
        ),

    PaymentStatus NVARCHAR(30) NOT NULL DEFAULT 'Pending'
        CONSTRAINT CK_Payments_Status
        CHECK
        (
            PaymentStatus IN
            (
                'Pending',
                'Success',
                'Failed',
                'Refunded'
            )
        ),

    TransactionId NVARCHAR(100),

    PaymentDate DATETIME2 NULL,

    Amount DECIMAL(18,2) NOT NULL
        CHECK (Amount >= 0),

    CONSTRAINT FK_Payments_Orders
        FOREIGN KEY (OrderId)
        REFERENCES Orders(OrderId)
);
GO


-- =============================================
-- SAMPLE USERS
-- =============================================

INSERT INTO Users
(
    FullName,
    Email,
    PasswordHash,
    Role,
    PhoneNumber,
    Address
)
VALUES
(
    'Admin User',
    'admin@retailflow.com',
    'TEMP_HASH',
    'admin',
    '9876543210',
    'Hyderabad'
),
(
    'Rahul Kumar',
    'rahul@gmail.com',
    'TEMP_HASH',
    'customer',
    '9876543211',
    'Bhimavaram'
),
(
    'Priya Sharma',
    'priya@gmail.com',
    'TEMP_HASH',
    'customer',
    '9876543212',
    'Hyderabad'
);
GO


-- =============================================
-- SAMPLE CATEGORIES
-- =============================================

INSERT INTO Categories
(
    CategoryName,
    Description
)
VALUES
(
    'Electronics',
    'Electronic devices and accessories'
),
(
    'Mobiles',
    'Smartphones and mobile accessories'
),
(
    'Laptops',
    'Laptops and computer accessories'
),
(
    'Home Appliances',
    'Home and kitchen appliances'
);
GO


-- =============================================
-- SAMPLE PRODUCTS
-- =============================================

INSERT INTO Products
(
    ProductName,
    Description,
    Price,
    StockQuantity,
    CategoryId
)
VALUES
(
    'Samsung Galaxy S25',
    'Samsung flagship smartphone',
    79999.00,
    25,
    2
),
(
    'iPhone 16',
    'Apple smartphone',
    69999.00,
    20,
    2
),
(
    'Dell Inspiron 15',
    'Dell laptop with Intel processor',
    64999.00,
    15,
    3
),
(
    'HP Pavilion',
    'HP performance laptop',
    72999.00,
    10,
    3
),
(
    'Sony Bravia TV',
    '55 inch 4K Smart TV',
    59999.00,
    12,
    1
),
(
    'LG Washing Machine',
    'Front load washing machine',
    42999.00,
    8,
    4
);
GO


-- =============================================
-- SAMPLE ORDER
-- =============================================

INSERT INTO Orders
(
    UserId,
    TotalAmount,
    Status,
    ShippingAddress
)
VALUES
(
    2,
    79999.00,
    'Confirmed',
    'Bhimavaram, Andhra Pradesh'
);
GO


-- =============================================
-- SAMPLE ORDER ITEM
-- =============================================

INSERT INTO OrderItems
(
    OrderId,
    ProductId,
    Quantity,
    UnitPrice
)
VALUES
(
    1,
    1,
    1,
    79999.00
);
GO


-- =============================================
-- SAMPLE PAYMENT
-- =============================================

INSERT INTO Payments
(
    OrderId,
    PaymentMethod,
    PaymentStatus,
    TransactionId,
    PaymentDate,
    Amount
)
VALUES
(
    1,
    'UPI',
    'Success',
    'TXN100001',
    GETDATE(),
    79999.00
);
GO



-- =============================================
-- VERIFY ALL TABLES
-- =============================================

SELECT * FROM Users;

SELECT * FROM Categories;

SELECT * FROM Products;

SELECT * FROM Orders;

SELECT * FROM OrderItems;

SELECT * FROM Payments;
GO
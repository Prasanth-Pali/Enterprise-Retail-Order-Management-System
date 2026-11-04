using Enterprise_Retail___Order_Management_System.Models;
using Enterprise_Retail___Order_Management_System.Services;
using Enterprise_Retail___Order_Management_System.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrWhiteSpace(jwtKey) ||
    Encoding.UTF8.GetByteCount(jwtKey) < 32)
{
    throw new InvalidOperationException(
        "Configure Jwt:Key with a secret of at least 32 bytes using user secrets or environment variables.");
}

var issuer = builder.Configuration["Jwt:Issuer"];
var audience = builder.Configuration["Jwt:Audience"];
if (string.IsNullOrWhiteSpace(issuer) ||
    string.IsNullOrWhiteSpace(audience))
{
    throw new InvalidOperationException(
        "Configure Jwt:Issuer and Jwt:Audience before starting the API.");
}

if (builder.Configuration.GetValue<int>("Jwt:ExpirationMinutes") <= 0)
{
    throw new InvalidOperationException(
        "Jwt:ExpirationMinutes must be greater than zero.");
}

var connectionString =
    builder.Configuration.GetConnectionString("RetailFlowConnection");
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "Configure the RetailFlowConnection connection string using user secrets or environment variables.");
}

var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>();
if (allowedOrigins is not { Length: > 0 })
{
    throw new InvalidOperationException(
        "Configure at least one origin in Cors:AllowedOrigins.");
}

// ===============================
// CORS - Angular Frontend
// ===============================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularClient", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


// ===============================
// JWT Authentication
// ===============================
builder.Services.AddAuthentication(
    JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,

                ValidateAudience = true,

                ValidateLifetime = true,

                ValidateIssuerSigningKey = true,

                ValidIssuer = issuer,

                ValidAudience = audience,

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtKey)
                    )
            };
    });


// ===============================
// Database
// ===============================
builder.Services.AddDbContext<RetailFlowDbContext>(
    options =>
        options.UseSqlServer(connectionString));


// ===============================
// Swagger
// ===============================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// ===============================
// Dependency Injection
// ===============================
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();


var app = builder.Build();


// ===============================
// Swagger
// ===============================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


// ===============================
// Middleware Pipeline
// ===============================
app.UseHttpsRedirection();

// CORS must come before Authentication
app.UseCors("AngularClient");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
using Enterprise_Retail___Order_Management_System.Models;
using Enterprise_Retail___Order_Management_System.Services;
using Microsoft.EntityFrameworkCore;
using RetailFlow.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddDbContext<RetailFlowDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("RetailFlowConnection")
    ));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
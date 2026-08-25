using Enterprise_Retail___Order_Management_System.DTOs;
using Enterprise_Retail___Order_Management_System.Models;
using Enterprise_Retail___Order_Management_System.Services;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.EntityFrameworkCore;


namespace RetailFlow.Services
{
    public class AuthService : IAuthService
    {
        private readonly RetailFlowDbContext _context;

        public AuthService(RetailFlowDbContext context)
        {
            _context = context;
        }

        public async Task<bool> RegisterAsync(Register request)
        {
            // Check if user already exists
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (existingUser != null)
            {
                return false;
            }

            // Create new user
            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = "Customer"
            };

            // Add user
            _context.Users.Add(user);

            // Save to database
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
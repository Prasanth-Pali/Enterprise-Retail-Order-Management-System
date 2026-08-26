using Enterprise_Retail___Order_Management_System.DTOs;
using Enterprise_Retail___Order_Management_System.Models;
using Enterprise_Retail___Order_Management_System.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


namespace RetailFlow.Services
{
    public class AuthService : IAuthService
    {
        private readonly RetailFlowDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(RetailFlowDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
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

        public async Task<String> LoginAsync(UserLogin userlogin)
        {
            // Find user by email
            var foundUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == userlogin.Email);
            if (foundUser == null || !BCrypt.Net.BCrypt.Verify(userlogin.Password, foundUser.PasswordHash))
            {
                return "Invalid email or password.";
            }
            // Here you would typically generate a JWT token or similar for the authenticated user
            // For simplicity, we will just return a success message
            //JWT token generation 

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, foundUser.Name),
                new Claim(ClaimTypes.Email, foundUser.Email),
                new Claim(ClaimTypes.Role, foundUser.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)); 

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
                );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
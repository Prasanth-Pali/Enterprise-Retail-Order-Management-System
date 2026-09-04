using Enterprise_Retail___Order_Management_System.DTOs.Users;
using Enterprise_Retail___Order_Management_System.Models;
using Enterprise_Retail___Order_Management_System.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Enterprise_Retail___Order_Management_System.Services;

public class UserService : IUserService
{
    private readonly RetailFlowDbContext _context;

    public UserService(RetailFlowDbContext context)
    {
        _context = context;
    }

    public async Task<(List<UserResponseDto> Users, int TotalCount)>
        GetUsersAsync(UserQueryDto query)
    {
        var usersQuery = _context.Users
            .AsNoTracking()
            .AsQueryable();

        // Search
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim();

            usersQuery = usersQuery.Where(x =>
                x.FullName.Contains(search) ||
                x.Email.Contains(search));
        }

        // Role filter
        if (!string.IsNullOrWhiteSpace(query.Role))
        {
            usersQuery = usersQuery.Where(x =>
                x.Role == query.Role);
        }

        // Active filter
        if (query.IsActive.HasValue)
        {
            usersQuery = usersQuery.Where(x =>
                x.IsActive == query.IsActive.Value);
        }

        // Total records before pagination
        var totalCount = await usersQuery.CountAsync();

        // Pagination
        var users = await usersQuery
            .OrderByDescending(x => x.CreatedAt)
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(x => new UserResponseDto
            {
                UserId = x.UserId,
                FullName = x.FullName,
                Email = x.Email,
                Role = x.Role,
                PhoneNumber = x.PhoneNumber,
                Address = x.Address,
                IsActive = x.IsActive,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync();

        return (users, totalCount);
    }

    public async Task<UserResponseDto?> GetUserByIdAsync(int userId)
    {
        return await _context.Users
            .AsNoTracking()
            .Where(x => x.UserId == userId)
            .Select(x => new UserResponseDto
            {
                UserId = x.UserId,
                FullName = x.FullName,
                Email = x.Email,
                Role = x.Role,
                PhoneNumber = x.PhoneNumber,
                Address = x.Address,
                IsActive = x.IsActive,
                CreatedAt = x.CreatedAt
            })
            .FirstOrDefaultAsync();
    }

    public async Task<bool> UpdateUserAsync(
        int userId,
        UpdateUserDto request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.UserId == userId);

        if (user == null)
        {
            return false;
        }

        user.FullName = request.FullName;
        user.PhoneNumber = request.PhoneNumber;
        user.Address = request.Address;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeactivateUserAsync(int userId)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.UserId == userId);

        if (user == null)
        {
            return false;
        }

        user.IsActive = false;

        await _context.SaveChangesAsync();

        return true;
    }
}
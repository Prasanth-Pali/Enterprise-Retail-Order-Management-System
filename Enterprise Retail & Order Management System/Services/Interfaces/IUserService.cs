using Enterprise_Retail___Order_Management_System.DTOs.Users;

namespace Enterprise_Retail___Order_Management_System.Services.Interfaces;

public interface IUserService
{
    Task<(List<UserResponseDto> Users, int TotalCount)> GetUsersAsync(
        UserQueryDto query);

    Task<UserResponseDto?> GetUserByIdAsync(int userId);

    Task<bool> UpdateUserAsync(
        int userId,
        UpdateUserDto request);

    Task<bool> DeactivateUserAsync(int userId);
}
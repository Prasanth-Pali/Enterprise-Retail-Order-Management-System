using Enterprise_Retail___Order_Management_System.DTOs;

namespace Enterprise_Retail___Order_Management_System.Services;

public interface IAuthService
{
    Task<bool> RegisterAsync(RegisterRequest request);

    Task<string?> LoginAsync(LoginRequest request);
}
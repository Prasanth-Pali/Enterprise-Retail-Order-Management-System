using Enterprise_Retail___Order_Management_System.DTOs;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

namespace Enterprise_Retail___Order_Management_System.Services
{
    public interface IAuthService
    {
        Task<bool> RegisterAsync(Register request);

        Task<string> LoginAsync(UserLogin userlogin);

    }
}

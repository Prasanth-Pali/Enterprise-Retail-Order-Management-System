using Enterprise_Retail___Order_Management_System.DTOs;
using Enterprise_Retail___Order_Management_System.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

namespace Enterprise_Retail___Order_Management_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(Register request)
        {
            var result = await _authService.RegisterAsync(request);

            if (!result)
            {
                return BadRequest("Email already exists.");
            }

            return Ok("User registered successfully.");
        }
    }
}

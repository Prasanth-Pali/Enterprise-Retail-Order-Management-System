using Enterprise_Retail___Order_Management_System.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Enterprise_Retail___Order_Management_System.Models;
using Microsoft.AspNetCore.Authorization;

namespace Enterprise_Retail___Order_Management_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IGetUsers _getUsersService;
        public AdminController(IGetUsers getUsersService)
        {
            _getUsersService = getUsersService;
        }
        [Authorize(Roles = "Customer")]
        [HttpGet("GetUsers")]
        public async Task<List<User>> GetAllUsers()
        {
            return await _getUsersService.GetAllUsersAsync();
        }
        }
    }

        
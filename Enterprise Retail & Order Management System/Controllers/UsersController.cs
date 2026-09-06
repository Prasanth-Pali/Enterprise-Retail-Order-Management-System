using Enterprise_Retail___Order_Management_System.DTOs.Users;
using Enterprise_Retail___Order_Management_System.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Enterprise_Retail___Order_Management_System.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> GetUsers(
        [FromQuery] UserQueryDto query)
    {
        var result = await _userService.GetUsersAsync(query);

        return Ok(new
        {
            data = result.Users,
            totalCount = result.TotalCount,
            pageNumber = query.PageNumber,
            pageSize = query.PageSize
        });
    }

    [HttpGet("{userId:int}")]
    [Authorize(Roles = "admin,customer")]
    public async Task<IActionResult> GetUserById(int userId)
    {
        var user = await _userService.GetUserByIdAsync(userId);

        if (user == null)
        {
            return NotFound("User not found.");
        }

        return Ok(user);
    }

    [HttpPut("{userId:int}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> UpdateUser(
        int userId,
        UpdateUserDto request)
    {
        var result = await _userService
            .UpdateUserAsync(userId, request);

        if (!result)
        {
            return NotFound("User not found.");
        }

        return Ok("User updated successfully.");
    }

    [HttpPatch("{userId:int}/deactivate")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> DeactivateUser(int userId)
    {
        var result = await _userService
            .DeactivateUserAsync(userId);

        if (!result)
        {
            return NotFound("User not found.");
        }

        return Ok("User deactivated successfully.");
    }
}
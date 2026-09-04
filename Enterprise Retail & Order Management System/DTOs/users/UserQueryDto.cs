using System.ComponentModel.DataAnnotations;

namespace Enterprise_Retail___Order_Management_System.DTOs.Users;

public class UserQueryDto
{
    [Range(1, 100)]
    public int PageNumber { get; set; } = 1;

    [Range(1, 100)]
    public int PageSize { get; set; } = 10;

    public string? Search { get; set; }

    public string? Role { get; set; }

    public bool? IsActive { get; set; }
}
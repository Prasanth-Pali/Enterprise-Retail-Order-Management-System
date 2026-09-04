using System.ComponentModel.DataAnnotations;

namespace Enterprise_Retail___Order_Management_System.DTOs.Users;

public class UpdateUserDto
{
    [Required]
    [StringLength(100, MinimumLength = 3)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [RegularExpression(
        @"^[0-9]{10}$",
        ErrorMessage = "Phone number must contain exactly 10 digits.")]
    public string PhoneNumber { get; set; } = string.Empty;

    [StringLength(250)]
    public string? Address { get; set; }
}
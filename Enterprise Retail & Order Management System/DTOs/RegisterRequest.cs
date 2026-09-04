using System.ComponentModel.DataAnnotations;

namespace Enterprise_Retail___Order_Management_System.DTOs;

public class RegisterRequest
{
    [Required]
    [StringLength(100, MinimumLength = 3)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [RegularExpression(
        @"^[a-zA-Z0-9._%+-]+@gmail\.com$",
        ErrorMessage = "Only Gmail addresses are allowed.")]
    public string Email { get; set; } = string.Empty;

    [Required]
    [RegularExpression(
        @"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$",
        ErrorMessage = "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character.")]
    public string Password { get; set; } = string.Empty;

    [Required]
    [RegularExpression(
        @"^[0-9]{10}$",
        ErrorMessage = "Phone number must contain exactly 10 digits.")]
    public string PhoneNumber { get; set; } = string.Empty;

    [StringLength(250)]
    public string? Address { get; set; }
}
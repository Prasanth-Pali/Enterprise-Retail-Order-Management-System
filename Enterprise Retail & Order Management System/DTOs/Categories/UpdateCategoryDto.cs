using System.ComponentModel.DataAnnotations;

namespace Enterprise_Retail___Order_Management_System.DTOs.Categories;

public class UpdateCategoryDto
{
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string CategoryName { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }
}
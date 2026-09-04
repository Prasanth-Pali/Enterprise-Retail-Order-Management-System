using System.ComponentModel.DataAnnotations;

namespace Enterprise_Retail___Order_Management_System.DTOs.Categories;

public class CategoryQueryDto
{
    [Range(1, 100)]
    public int PageNumber { get; set; } = 1;

    [Range(1, 100)]
    public int PageSize { get; set; } = 10;

    public string? Search { get; set; }

    public bool? IsActive { get; set; }
}
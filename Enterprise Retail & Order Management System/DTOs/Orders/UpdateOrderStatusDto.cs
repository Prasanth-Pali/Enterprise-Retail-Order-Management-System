using System.ComponentModel.DataAnnotations;

namespace Enterprise_Retail___Order_Management_System.DTOs.Orders;

public class UpdateOrderStatusDto
{
    [Required]
    public string Status { get; set; } = string.Empty;
}
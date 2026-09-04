using System.ComponentModel.DataAnnotations;

namespace Enterprise_Retail___Order_Management_System.DTOs.Orders;

public class CreateOrderDto
{
    [Required]
    [MinLength(1)]
    public List<CreateOrderItemDto> Items { get; set; } = new();

    [Required]
    [StringLength(250, MinimumLength = 5)]
    public string ShippingAddress { get; set; } = string.Empty;
}

public class CreateOrderItemDto
{
    [Range(1, int.MaxValue)]
    public int ProductId { get; set; }

    [Range(1, 1000)]
    public int Quantity { get; set; }
}
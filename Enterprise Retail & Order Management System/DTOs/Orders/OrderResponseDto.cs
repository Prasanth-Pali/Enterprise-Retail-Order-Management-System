namespace Enterprise_Retail___Order_Management_System.DTOs.Orders;

public class OrderResponseDto
{
    public int OrderId { get; set; }

    public int UserId { get; set; }

    public string CustomerName { get; set; } = string.Empty;

    public DateTime OrderDate { get; set; }

    public decimal TotalAmount { get; set; }

    public string Status { get; set; } = string.Empty;

    public string? ShippingAddress { get; set; }

    public List<OrderItemResponseDto> Items { get; set; } = new();
}
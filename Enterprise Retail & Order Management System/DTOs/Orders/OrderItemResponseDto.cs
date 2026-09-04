namespace Enterprise_Retail___Order_Management_System.DTOs.Orders;

public class OrderItemResponseDto
{
    public int OrderItemId { get; set; }

    public int ProductId { get; set; }

    public string ProductName { get; set; } = string.Empty;

    public int Quantity { get; set; }

    public decimal UnitPrice { get; set; }

    public decimal SubTotal { get; set; }
}
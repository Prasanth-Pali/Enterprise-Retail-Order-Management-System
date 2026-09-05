
namespace Enterprise_Retail___Order_Management_System.DTOs.Payments;

public class PaymentQueryDto
{
    public int PageNumber { get; set; } = 1;

    public int PageSize { get; set; } = 10;

    public string? Search { get; set; }

    public string? PaymentStatus { get; set; }
}

namespace Enterprise_Retail___Order_Management_System.DTOs.Payments;

public class PaymentResponseDto
{
    public int PaymentId { get; set; }
    public int OrderId { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
    public string? TransactionId { get; set; }
    public DateTime? PaymentDate { get; set; }
    public decimal Amount { get; set; }
}
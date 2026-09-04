using System.ComponentModel.DataAnnotations;

namespace Enterprise_Retail___Order_Management_System.DTOs.Payments;

public class CreatePaymentDto
{
    [Range(1, int.MaxValue)]
    public int OrderId { get; set; }

    [Required]
    public string PaymentMethod { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue)]
    public decimal Amount { get; set; }
}
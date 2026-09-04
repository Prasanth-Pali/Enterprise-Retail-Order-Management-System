using Enterprise_Retail___Order_Management_System.DTOs.Payments;

namespace Enterprise_Retail___Order_Management_System.Services.Interfaces;

public interface IPaymentService
{
    Task<PaymentResponseDto?> CreatePaymentAsync(
        int userId,
        CreatePaymentDto request);

    Task<PaymentResponseDto?> GetPaymentByOrderIdAsync(
        int orderId,
        int userId,
        string role);
}
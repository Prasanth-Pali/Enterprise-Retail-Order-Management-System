using Enterprise_Retail___Order_Management_System.DTOs.Orders;

namespace Enterprise_Retail___Order_Management_System.Services.Interfaces;

public interface IOrderService
{
    Task<OrderResponseDto?> CreateOrderAsync(
        int userId,
        CreateOrderDto request);

    Task<(List<OrderResponseDto> Orders, int TotalCount)>
        GetOrdersAsync(
            int userId,
            string role,
            OrderQueryDto query);

    Task<OrderResponseDto?> GetOrderByIdAsync(
        int orderId,
        int userId,
        string role);

    Task<bool> UpdateOrderStatusAsync(
        int orderId,
        UpdateOrderStatusDto request);
}
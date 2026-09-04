using Enterprise_Retail___Order_Management_System.DTOs.Orders;
using Enterprise_Retail___Order_Management_System.Models;
using Enterprise_Retail___Order_Management_System.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Enterprise_Retail___Order_Management_System.Services;

public class OrderService : IOrderService
{
    private readonly RetailFlowDbContext _context;

    public OrderService(RetailFlowDbContext context)
    {
        _context = context;
    }

    public async Task<OrderResponseDto?> CreateOrderAsync(
        int userId,
        CreateOrderDto request)
    {
        if (request.Items == null ||
            request.Items.Count == 0)
        {
            return null;
        }

        var userExists = await _context.Users
            .AnyAsync(x =>
                x.UserId == userId &&
                x.IsActive);

        if (!userExists)
        {
            return null;
        }

        var productIds = request.Items
            .Select(x => x.ProductId)
            .Distinct()
            .ToList();

        // Prevent duplicate products in the same order.
        if (request.Items.Count != productIds.Count)
        {
            return null;
        }

        var products = await _context.Products
            .Where(x =>
                productIds.Contains(x.ProductId) &&
                x.IsActive)
            .ToListAsync();

        if (products.Count != productIds.Count)
        {
            return null;
        }

        // Validate stock before creating the order.
        foreach (var item in request.Items)
        {
            var product = products.First(
                x => x.ProductId == item.ProductId);

            if (item.Quantity > product.StockQuantity)
            {
                return null;
            }
        }

        await using var transaction =
            await _context.Database.BeginTransactionAsync();

        try
        {
            decimal totalAmount = 0m;

            var order = new Order
            {
                UserId = userId,
                OrderDate = DateTime.UtcNow,
                Status = "Pending",
                ShippingAddress = request.ShippingAddress.Trim(),
                TotalAmount = 0m
            };

            _context.Orders.Add(order);

            await _context.SaveChangesAsync();

            foreach (var item in request.Items)
            {
                var product = products.First(
                    x => x.ProductId == item.ProductId);

                decimal subTotal =
                    product.Price * item.Quantity;

                totalAmount += subTotal;

                var orderItem = new OrderItem
                {
                    OrderId = order.OrderId,
                    ProductId = product.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = product.Price
                };

                _context.OrderItems.Add(orderItem);

                // Reduce stock within the same transaction.
                product.StockQuantity -= item.Quantity;
                product.UpdatedAt = DateTime.UtcNow;
            }

            order.TotalAmount = totalAmount;

            await _context.SaveChangesAsync();

            await transaction.CommitAsync();

            return await GetOrderByIdAsync(
                order.OrderId,
                userId,
                "customer");
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<(List<OrderResponseDto> Orders, int TotalCount)>
        GetOrdersAsync(
            int userId,
            string role,
            OrderQueryDto query)
    {
        var ordersQuery = _context.Orders
            .AsNoTracking()
            .Include(x => x.User)
            .Include(x => x.OrderItems)
                .ThenInclude(x => x.Product)
            .AsQueryable();

        // Customer can see only their own orders.
        if (role.Equals(
            "customer",
            StringComparison.OrdinalIgnoreCase))
        {
            ordersQuery = ordersQuery
                .Where(x => x.UserId == userId);
        }

        // Admin can see all orders.
        if (!string.IsNullOrWhiteSpace(query.Status))
        {
            ordersQuery = ordersQuery
                .Where(x => x.Status == query.Status.Trim());
        }

        var totalCount =
            await ordersQuery.CountAsync();

        var orders = await ordersQuery
            .OrderByDescending(x => x.OrderDate)
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(x => new OrderResponseDto
            {
                OrderId = x.OrderId,
                UserId = x.UserId,
                CustomerName = x.User.FullName,
                OrderDate = x.OrderDate,
                TotalAmount = x.TotalAmount,
                Status = x.Status,
                ShippingAddress = x.ShippingAddress,

                Items = x.OrderItems
                    .Select(item => new OrderItemResponseDto
                    {
                        OrderItemId = item.OrderItemId,
                        ProductId = item.ProductId,
                        ProductName = item.Product.ProductName,
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice,
                        SubTotal = item.SubTotal ?? 0m
                    })
                    .ToList()
            })
            .ToListAsync();

        return (orders, totalCount);
    }

    public async Task<OrderResponseDto?> GetOrderByIdAsync(
        int orderId,
        int userId,
        string role)
    {
        var ordersQuery = _context.Orders
            .AsNoTracking()
            .Include(x => x.User)
            .Include(x => x.OrderItems)
                .ThenInclude(x => x.Product)
            .Where(x => x.OrderId == orderId);

        // Customer can access only their own order.
        if (role.Equals(
            "customer",
            StringComparison.OrdinalIgnoreCase))
        {
            ordersQuery = ordersQuery
                .Where(x => x.UserId == userId);
        }

        return await ordersQuery
            .Select(x => new OrderResponseDto
            {
                OrderId = x.OrderId,
                UserId = x.UserId,
                CustomerName = x.User.FullName,
                OrderDate = x.OrderDate,
                TotalAmount = x.TotalAmount,
                Status = x.Status,
                ShippingAddress = x.ShippingAddress,

                Items = x.OrderItems
                    .Select(item => new OrderItemResponseDto
                    {
                        OrderItemId = item.OrderItemId,
                        ProductId = item.ProductId,
                        ProductName = item.Product.ProductName,
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice,
                        SubTotal = item.SubTotal ?? 0m
                    })
                    .ToList()
            })
            .FirstOrDefaultAsync();
    }

    public async Task<bool> UpdateOrderStatusAsync(
        int orderId,
        UpdateOrderStatusDto request)
    {
        var order = await _context.Orders
            .FirstOrDefaultAsync(x =>
                x.OrderId == orderId);

        if (order == null)
        {
            return false;
        }

        var newStatus =
            request.Status.Trim();

        var validStatuses = new[]
        {
            "Pending",
            "Confirmed",
            "Shipped",
            "Delivered",
            "Cancelled"
        };

        if (!validStatuses.Contains(
            newStatus,
            StringComparer.OrdinalIgnoreCase))
        {
            return false;
        }

        var currentStatus =
            order.Status;

        // Delivered and Cancelled are final states.
        if (currentStatus.Equals(
                "Delivered",
                StringComparison.OrdinalIgnoreCase) ||
            currentStatus.Equals(
                "Cancelled",
                StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        // Valid order status transitions.
        var validTransition =
            currentStatus switch
            {
                "Pending" =>
                    newStatus.Equals(
                        "Confirmed",
                        StringComparison.OrdinalIgnoreCase)
                    ||
                    newStatus.Equals(
                        "Cancelled",
                        StringComparison.OrdinalIgnoreCase),

                "Confirmed" =>
                    newStatus.Equals(
                        "Shipped",
                        StringComparison.OrdinalIgnoreCase)
                    ||
                    newStatus.Equals(
                        "Cancelled",
                        StringComparison.OrdinalIgnoreCase),

                "Shipped" =>
                    newStatus.Equals(
                        "Delivered",
                        StringComparison.OrdinalIgnoreCase),

                _ => false
            };

        if (!validTransition)
        {
            return false;
        }

        order.Status = validStatuses.First(
            x => x.Equals(
                newStatus,
                StringComparison.OrdinalIgnoreCase));

        await _context.SaveChangesAsync();

        return true;
    }
}
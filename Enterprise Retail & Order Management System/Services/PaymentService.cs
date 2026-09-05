using Enterprise_Retail___Order_Management_System.DTOs.Payments;
using Enterprise_Retail___Order_Management_System.Models;
using Enterprise_Retail___Order_Management_System.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Enterprise_Retail___Order_Management_System.Services;

public class PaymentService : IPaymentService
{
    private readonly RetailFlowDbContext _context;

    public PaymentService(RetailFlowDbContext context)
    {
        _context = context;
    }



    public async Task<PaymentResponseDto?> CreatePaymentAsync(
        int userId,
        CreatePaymentDto request)
    {
        // Check whether order exists and belongs to the user
        var order = await _context.Orders
            .FirstOrDefaultAsync(x =>
                x.OrderId == request.OrderId &&
                x.UserId == userId);

        if (order == null)
        {
            return null;
        }

        // Payment already exists
        var existingPayment = await _context.Payments
            .FirstOrDefaultAsync(x =>
                x.OrderId == request.OrderId);

        if (existingPayment != null)
        {
            return null;
        }

        // Order must be pending
        if (!order.Status.Equals(
                "Pending",
                StringComparison.OrdinalIgnoreCase))
        {
            return null;
        }

        // Payment amount must match order total
        if (request.Amount != order.TotalAmount)
        {
            return null;
        }

        var validMethods = new[]
        {
            "CreditCard",
            "DebitCard",
            "UPI",
            "NetBanking",
            "CashOnDelivery"
        };

        var paymentMethod = validMethods.FirstOrDefault(
            x => x.Equals(
                request.PaymentMethod.Trim(),
                StringComparison.OrdinalIgnoreCase));

        if (paymentMethod == null)
        {
            return null;
        }

        await using var transaction =
            await _context.Database.BeginTransactionAsync();

        try
        {
            var payment = new Payment
            {
                OrderId = order.OrderId,
                PaymentMethod = paymentMethod,
                PaymentStatus = "Success",
                TransactionId = Guid.NewGuid()
                    .ToString("N")
                    .ToUpper(),
                PaymentDate = DateTime.UtcNow,
                Amount = order.TotalAmount
            };

            _context.Payments.Add(payment);

            // Successful payment confirms the order
            order.Status = "Confirmed";

            await _context.SaveChangesAsync();

            await transaction.CommitAsync();

            return new PaymentResponseDto
            {
                PaymentId = payment.PaymentId,
                OrderId = payment.OrderId,
                PaymentMethod = payment.PaymentMethod,
                PaymentStatus = payment.PaymentStatus,
                TransactionId = payment.TransactionId,
                PaymentDate = payment.PaymentDate,
                Amount = payment.Amount
            };
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<PaymentResponseDto?> GetPaymentByOrderIdAsync(
        int orderId,
        int userId,
        string role)
    {
        var query = _context.Payments
            .AsNoTracking()
            .Include(x => x.Order)
            .Where(x => x.OrderId == orderId);

        // Customer can see only their own payment
        if (role.Equals(
                "customer",
                StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(x =>
                x.Order.UserId == userId);
        }

        return await query
            .Select(x => new PaymentResponseDto
            {
                PaymentId = x.PaymentId,
                OrderId = x.OrderId,
                PaymentMethod = x.PaymentMethod,
                PaymentStatus = x.PaymentStatus,
                TransactionId = x.TransactionId,
                PaymentDate = x.PaymentDate,
                Amount = x.Amount
            })
            .FirstOrDefaultAsync();
    }

    public async Task<(List<PaymentResponseDto> Payments, int TotalCount)>
    GetPaymentsAsync(PaymentQueryDto query)
    {
        var paymentsQuery = _context.Payments
            .AsNoTracking()
            .AsQueryable();

        // Search by Order ID or Transaction ID
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim();

            if (int.TryParse(search, out int orderId))
            {
                paymentsQuery = paymentsQuery.Where(x =>
                    x.OrderId == orderId ||
                    (x.TransactionId != null &&
                     x.TransactionId.Contains(search)));
            }
            else
            {
                paymentsQuery = paymentsQuery.Where(x =>
                    x.TransactionId != null &&
                    x.TransactionId.Contains(search));
            }
        }

        // Filter by payment status
        if (!string.IsNullOrWhiteSpace(query.PaymentStatus))
        {
            paymentsQuery = paymentsQuery.Where(x =>
                x.PaymentStatus == query.PaymentStatus);
        }

        var totalCount = await paymentsQuery.CountAsync();

        // Pagination
        var payments = await paymentsQuery
            .OrderByDescending(x => x.PaymentDate)
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(x => new PaymentResponseDto
            {
                PaymentId = x.PaymentId,
                OrderId = x.OrderId,
                PaymentMethod = x.PaymentMethod,
                PaymentStatus = x.PaymentStatus,
                TransactionId = x.TransactionId,
                PaymentDate = x.PaymentDate,
                Amount = x.Amount
            })
            .ToListAsync();

        return (payments, totalCount);
    }

}
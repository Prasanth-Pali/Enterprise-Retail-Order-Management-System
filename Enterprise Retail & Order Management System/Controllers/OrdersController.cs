using Enterprise_Retail___Order_Management_System.DTOs.Orders;
using Enterprise_Retail___Order_Management_System.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Enterprise_Retail___Order_Management_System.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(
        IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost]
    [Authorize(Roles = "customer")]
    public async Task<IActionResult> CreateOrder(
        CreateOrderDto request)
    {
        var userIdClaim = User.FindFirst(
            ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(
            userIdClaim,
            out var userId))
        {
            return Unauthorized();
        }

        var order = await _orderService
            .CreateOrderAsync(userId, request);

        if (order == null)
        {
            return BadRequest(
                "Unable to create order. " +
                "Check products, quantities, stock, " +
                "and request details.");
        }

        return CreatedAtAction(
            nameof(GetOrderById),
            new
            {
                orderId = order.OrderId
            },
            order);
    }

    [HttpGet]
    [Authorize(Roles = "admin,customer")]
    public async Task<IActionResult> GetOrders(
        [FromQuery] OrderQueryDto query)
    {
        var userIdClaim = User.FindFirst(
            ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(
            userIdClaim,
            out var userId))
        {
            return Unauthorized();
        }

        var role = User.FindFirst(
            ClaimTypes.Role)?.Value;

        if (string.IsNullOrWhiteSpace(role))
        {
            return Forbid();
        }

        var result = await _orderService
            .GetOrdersAsync(
                userId,
                role,
                query);

        return Ok(new
        {
            data = result.Orders,
            totalCount = result.TotalCount,
            pageNumber = query.PageNumber,
            pageSize = query.PageSize
        });
    }

    [HttpGet("{orderId:int}")]
    [Authorize(Roles = "admin,customer")]
    public async Task<IActionResult> GetOrderById(
        int orderId)
    {
        var userIdClaim = User.FindFirst(
            ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(
            userIdClaim,
            out var userId))
        {
            return Unauthorized();
        }

        var role = User.FindFirst(
            ClaimTypes.Role)?.Value;

        if (string.IsNullOrWhiteSpace(role))
        {
            return Forbid();
        }

        var order = await _orderService
            .GetOrderByIdAsync(
                orderId,
                userId,
                role);

        if (order == null)
        {
            return NotFound("Order not found.");
        }

        return Ok(order);
    }

    [HttpPatch("{orderId:int}/status")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> UpdateOrderStatus(
        int orderId,
        UpdateOrderStatusDto request)
    {
        var result = await _orderService
            .UpdateOrderStatusAsync(
                orderId,
                request);

        if (!result)
        {
            return BadRequest(
                "Order not found or invalid status transition.");
        }

        return Ok(
            "Order status updated successfully.");
    }
}
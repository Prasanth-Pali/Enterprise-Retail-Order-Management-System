using System.Security.Claims;
using Enterprise_Retail___Order_Management_System.DTOs.Payments;
using Enterprise_Retail___Order_Management_System.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Enterprise_Retail___Order_Management_System.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentsController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    [HttpPost]
    [Authorize(Roles = "customer")]
    public async Task<IActionResult> CreatePayment(
        CreatePaymentDto request)
    {
        var userIdClaim = User.FindFirst(
            ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized();
        }

        var payment =
            await _paymentService.CreatePaymentAsync(
                userId,
                request);

        if (payment == null)
        {
            return BadRequest(
                "Payment could not be processed. " +
                "Check order, amount, payment method, or payment status.");
        }

        return Ok(payment);
    }

    [HttpGet("order/{orderId:int}")]
    [Authorize(Roles = "admin,customer")]
    public async Task<IActionResult> GetPaymentByOrderId(
        int orderId)
    {
        var userIdClaim = User.FindFirst(
            ClaimTypes.NameIdentifier)?.Value;

        var role = User.FindFirst(
            ClaimTypes.Role)?.Value;

        if (!int.TryParse(userIdClaim, out int userId) ||
            string.IsNullOrWhiteSpace(role))
        {
            return Unauthorized();
        }

        var payment =
            await _paymentService.GetPaymentByOrderIdAsync(
                orderId,
                userId,
                role);

        if (payment == null)
        {
            return NotFound(
                "Payment not found.");
        }

        return Ok(payment);
    }
}
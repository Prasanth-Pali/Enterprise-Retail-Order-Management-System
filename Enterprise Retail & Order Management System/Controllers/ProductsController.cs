using Enterprise_Retail___Order_Management_System.DTOs.Products;
using Enterprise_Retail___Order_Management_System.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Enterprise_Retail___Order_Management_System.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(
        IProductService productService)
    {
        _productService = productService;
    }

    // GET: api/Products
    // Admin + Customer
    [HttpGet]
    [Authorize(Roles = "admin,customer")]
    public async Task<IActionResult> GetProducts(
        [FromQuery] ProductQueryDto query)
    {
        var role = User.FindFirst(
            ClaimTypes.Role)?.Value;

        if (string.IsNullOrWhiteSpace(role))
        {
            return Forbid();
        }

        var result = await _productService
            .GetProductsAsync(query, role);

        return Ok(new
        {
            data = result.Products,
            totalCount = result.TotalCount,
            pageNumber = query.PageNumber,
            pageSize = query.PageSize
        });
    }

    // GET: api/Products/1
    // Admin + Customer
    [HttpGet("{productId:int}")]
    [Authorize(Roles = "admin,customer")]
    public async Task<IActionResult> GetProductById(
        int productId)
    {
        var role = User.FindFirst(
            ClaimTypes.Role)?.Value;

        if (string.IsNullOrWhiteSpace(role))
        {
            return Forbid();
        }

        var product = await _productService
            .GetProductByIdAsync(productId, role);

        if (product == null)
        {
            return NotFound("Product not found.");
        }

        return Ok(product);
    }

    // POST: api/Products
    // Admin only
    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> CreateProduct(
        CreateProductDto request)
    {
        var product = await _productService
            .CreateProductAsync(request);

        if (product == null)
        {
            return Conflict(
                "Category is invalid or product already exists.");
        }

        return CreatedAtAction(
            nameof(GetProductById),
            new
            {
                productId = product.ProductId
            },
            product);
    }

    // PUT: api/Products/1
    // Admin only
    [HttpPut("{productId:int}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> UpdateProduct(
        int productId,
        UpdateProductDto request)
    {
        var result = await _productService
            .UpdateProductAsync(
                productId,
                request);

        if (!result)
        {
            return NotFound(
                "Product not found, category is invalid, " +
                "or product already exists.");
        }

        return Ok(
            "Product updated successfully.");
    }

    // PATCH: api/Products/1/deactivate
    // Admin only
    [HttpPatch("{productId:int}/deactivate")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> DeactivateProduct(
        int productId)
    {
        var result = await _productService
            .DeactivateProductAsync(productId);

        if (!result)
        {
            return NotFound("Product not found.");
        }

        return Ok(
            "Product deactivated successfully.");
    }
}
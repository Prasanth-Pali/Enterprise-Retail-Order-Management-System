using Enterprise_Retail___Order_Management_System.DTOs.Categories;
using Enterprise_Retail___Order_Management_System.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Enterprise_Retail___Order_Management_System.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(
        ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    [Authorize(Roles = "admin,customer")]
    public async Task<IActionResult> GetCategories(
        [FromQuery] CategoryQueryDto query)
    {
        var role = User.FindFirst(
            ClaimTypes.Role)?.Value;

        if (string.IsNullOrWhiteSpace(role))
        {
            return Forbid();
        }

        var result = await _categoryService
            .GetCategoriesAsync(query, role);

        return Ok(new
        {
            data = result.Categories,
            totalCount = result.TotalCount,
            pageNumber = query.PageNumber,
            pageSize = query.PageSize
        });
    }

    [HttpGet("{categoryId:int}")]
    [Authorize(Roles = "admin,customer")]
    public async Task<IActionResult> GetCategoryById(
        int categoryId)
    {
        var role = User.FindFirst(
            ClaimTypes.Role)?.Value;

        if (string.IsNullOrWhiteSpace(role))
        {
            return Forbid();
        }

        var category = await _categoryService
            .GetCategoryByIdAsync(categoryId, role);

        if (category == null)
        {
            return NotFound("Category not found.");
        }

        return Ok(category);
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> CreateCategory(
        CreateCategoryDto request)
    {
        var category = await _categoryService
            .CreateCategoryAsync(request);

        if (category == null)
        {
            return Conflict(
                "A category with this name already exists.");
        }

        return CreatedAtAction(
            nameof(GetCategoryById),
            new
            {
                categoryId = category.CategoryId
            },
            category);
    }

    [HttpPut("{categoryId:int}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> UpdateCategory(
        int categoryId,
        UpdateCategoryDto request)
    {
        var result = await _categoryService
            .UpdateCategoryAsync(
                categoryId,
                request);

        if (!result)
        {
            return NotFound(
                "Category not found or category name already exists.");
        }

        return Ok(
            "Category updated successfully.");
    }

    [HttpPatch("{categoryId:int}/deactivate")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> DeactivateCategory(
        int categoryId)
    {
        var result = await _categoryService
            .DeactivateCategoryAsync(categoryId);

        if (!result)
        {
            return NotFound(
                "Category not found or category is already inactive.");
        }

        return Ok(
            "Category deactivated successfully.");
    }
}
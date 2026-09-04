using Enterprise_Retail___Order_Management_System.DTOs.Categories;
using Enterprise_Retail___Order_Management_System.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Enterprise_Retail___Order_Management_System.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    // GET: api/Categories
    [HttpGet]
    [Authorize(Roles = "admin,customer")]
    public async Task<IActionResult> GetCategories(
        [FromQuery] CategoryQueryDto query)
    {
        var result = await _categoryService
            .GetCategoriesAsync(query);

        return Ok(new
        {
            data = result.Categories,
            totalCount = result.TotalCount,
            pageNumber = query.PageNumber,
            pageSize = query.PageSize
        });
    }

    // GET: api/Categories/1
    [Authorize(Roles = "admin")]
    [HttpGet("{categoryId:int}")]
    public async Task<IActionResult> GetCategoryById(
        int categoryId)
    {
        var category = await _categoryService
            .GetCategoryByIdAsync(categoryId);

        if (category == null)
        {
            return NotFound("Category not found.");
        }

        return Ok(category);
    }

    // POST: api/Categories
    [Authorize(Roles = "admin")]
    [HttpPost]
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
            new { categoryId = category.CategoryId },
            category);
    }

    // PUT: api/Categories/1
    [Authorize(Roles = "admin")]
    [HttpPut("{categoryId:int}")]
    public async Task<IActionResult> UpdateCategory(
        int categoryId,
        UpdateCategoryDto request)
    {
        var result = await _categoryService
            .UpdateCategoryAsync(categoryId, request);

        if (!result)
        {
            return NotFound(
                "Category not found or category name already exists.");
        }

        return Ok("Category updated successfully.");
    }

    // PATCH: api/Categories/1/deactivate
    [Authorize(Roles = "admin")]
    [HttpPatch("{categoryId:int}/deactivate")]
    public async Task<IActionResult> DeactivateCategory(
        int categoryId)
    {
        var result = await _categoryService
            .DeactivateCategoryAsync(categoryId);

        if (!result)
        {
            return NotFound("Category not found.");
        }

        return Ok("Category deactivated successfully.");
    }
}
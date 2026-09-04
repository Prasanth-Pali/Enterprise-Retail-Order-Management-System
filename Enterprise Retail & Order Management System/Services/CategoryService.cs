using Enterprise_Retail___Order_Management_System.DTOs.Categories;
using Enterprise_Retail___Order_Management_System.Models;
using Enterprise_Retail___Order_Management_System.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Enterprise_Retail___Order_Management_System.Services;

public class CategoryService : ICategoryService
{
    private readonly RetailFlowDbContext _context;

    public CategoryService(RetailFlowDbContext context)
    {
        _context = context;
    }

    public async Task<(List<CategoryResponseDto> Categories, int TotalCount)>
        GetCategoriesAsync(CategoryQueryDto query)
    {
        var categoriesQuery = _context.Categories
            .AsNoTracking()
            .AsQueryable();

        // Search
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim();

            categoriesQuery = categoriesQuery.Where(x =>
                x.CategoryName.Contains(search) ||
                (x.Description != null &&
                 x.Description.Contains(search)));
        }

        // Active / Inactive filter
        if (query.IsActive.HasValue)
        {
            categoriesQuery = categoriesQuery.Where(x =>
                x.IsActive == query.IsActive.Value);
        }

        // Total records before pagination
        var totalCount = await categoriesQuery.CountAsync();

        // Pagination
        var categories = await categoriesQuery
            .OrderByDescending(x => x.CreatedAt)
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(x => new CategoryResponseDto
            {
                CategoryId = x.CategoryId,
                CategoryName = x.CategoryName,
                Description = x.Description,
                IsActive = x.IsActive,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync();

        return (categories, totalCount);
    }

    public async Task<CategoryResponseDto?> GetCategoryByIdAsync(
        int categoryId)
    {
        return await _context.Categories
            .AsNoTracking()
            .Where(x => x.CategoryId == categoryId)
            .Select(x => new CategoryResponseDto
            {
                CategoryId = x.CategoryId,
                CategoryName = x.CategoryName,
                Description = x.Description,
                IsActive = x.IsActive,
                CreatedAt = x.CreatedAt
            })
            .FirstOrDefaultAsync();
    }

    public async Task<CategoryResponseDto?> CreateCategoryAsync(
        CreateCategoryDto request)
    {
        var categoryName = request.CategoryName.Trim();

        // Prevent duplicate category
        var exists = await _context.Categories
            .AnyAsync(x => x.CategoryName == categoryName);

        if (exists)
        {
            return null;
        }

        var category = new Category
        {
            CategoryName = categoryName,
            Description = request.Description?.Trim(),
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Categories.Add(category);

        await _context.SaveChangesAsync();

        return new CategoryResponseDto
        {
            CategoryId = category.CategoryId,
            CategoryName = category.CategoryName,
            Description = category.Description,
            IsActive = category.IsActive,
            CreatedAt = category.CreatedAt
        };
    }

    public async Task<bool> UpdateCategoryAsync(
        int categoryId,
        UpdateCategoryDto request)
    {
        var category = await _context.Categories
            .FirstOrDefaultAsync(x => x.CategoryId == categoryId);

        if (category == null)
        {
            return false;
        }

        var categoryName = request.CategoryName.Trim();

        // Check duplicate name
        var duplicateExists = await _context.Categories
            .AnyAsync(x =>
                x.CategoryId != categoryId &&
                x.CategoryName == categoryName);

        if (duplicateExists)
        {
            return false;
        }

        category.CategoryName = categoryName;
        category.Description = request.Description?.Trim();

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeactivateCategoryAsync(
        int categoryId)
    {
        var category = await _context.Categories
            .FirstOrDefaultAsync(x => x.CategoryId == categoryId);

        if (category == null)
        {
            return false;
        }

        category.IsActive = false;

        await _context.SaveChangesAsync();

        return true;
    }
}
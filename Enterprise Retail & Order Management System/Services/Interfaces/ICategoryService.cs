using Enterprise_Retail___Order_Management_System.DTOs.Categories;

namespace Enterprise_Retail___Order_Management_System.Services.Interfaces;

public interface ICategoryService
{
    Task<(List<CategoryResponseDto> Categories, int TotalCount)>
        GetCategoriesAsync(CategoryQueryDto query);

    Task<CategoryResponseDto?> GetCategoryByIdAsync(int categoryId);

    Task<CategoryResponseDto?> CreateCategoryAsync(
        CreateCategoryDto request);

    Task<bool> UpdateCategoryAsync(
        int categoryId,
        UpdateCategoryDto request);

    Task<bool> DeactivateCategoryAsync(int categoryId);
}
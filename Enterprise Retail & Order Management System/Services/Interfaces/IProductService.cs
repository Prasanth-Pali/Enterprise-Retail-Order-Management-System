using Enterprise_Retail___Order_Management_System.DTOs.Products;

namespace Enterprise_Retail___Order_Management_System.Services.Interfaces;

public interface IProductService
{
    Task<(List<ProductResponseDto> Products, int TotalCount)>
        GetProductsAsync(
            ProductQueryDto query,
            string role);

    Task<ProductResponseDto?> GetProductByIdAsync(
        int productId,
        string role);

    Task<ProductResponseDto?> CreateProductAsync(
        CreateProductDto request);

    Task<bool> UpdateProductAsync(
        int productId,
        UpdateProductDto request);

    Task<bool> DeactivateProductAsync(
        int productId);
}
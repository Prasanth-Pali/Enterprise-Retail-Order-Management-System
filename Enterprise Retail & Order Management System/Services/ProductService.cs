using Enterprise_Retail___Order_Management_System.DTOs.Products;
using Enterprise_Retail___Order_Management_System.Models;
using Enterprise_Retail___Order_Management_System.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Enterprise_Retail___Order_Management_System.Services;

public class ProductService : IProductService
{
    private readonly RetailFlowDbContext _context;

    public ProductService(RetailFlowDbContext context)
    {
        _context = context;
    }

    public async Task<(List<ProductResponseDto> Products, int TotalCount)>
        GetProductsAsync(ProductQueryDto query)
    {
        var productsQuery = _context.Products
            .AsNoTracking()
            .Include(x => x.Category)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim();

            productsQuery = productsQuery.Where(x =>
                x.ProductName.Contains(search) ||
                (x.Description != null &&
                 x.Description.Contains(search)));
        }

        if (query.CategoryId.HasValue)
        {
            productsQuery = productsQuery.Where(x =>
                x.CategoryId == query.CategoryId.Value);
        }

        if (query.IsActive.HasValue)
        {
            productsQuery = productsQuery.Where(x =>
                x.IsActive == query.IsActive.Value);
        }

        if (query.MinPrice.HasValue)
        {
            productsQuery = productsQuery.Where(x =>
                x.Price >= query.MinPrice.Value);
        }

        if (query.MaxPrice.HasValue)
        {
            productsQuery = productsQuery.Where(x =>
                x.Price <= query.MaxPrice.Value);
        }

        var totalCount = await productsQuery.CountAsync();

        var products = await productsQuery
            .OrderByDescending(x => x.CreatedAt)
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(x => new ProductResponseDto
            {
                ProductId = x.ProductId,
                ProductName = x.ProductName,
                Description = x.Description,
                Price = x.Price,
                StockQuantity = x.StockQuantity,
                CategoryId = x.CategoryId,
                CategoryName = x.Category.CategoryName,
                IsActive = x.IsActive,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt
            })
            .ToListAsync();

        return (products, totalCount);
    }

    public async Task<ProductResponseDto?> GetProductByIdAsync(
        int productId)
    {
        return await _context.Products
            .AsNoTracking()
            .Include(x => x.Category)
            .Where(x => x.ProductId == productId)
            .Select(x => new ProductResponseDto
            {
                ProductId = x.ProductId,
                ProductName = x.ProductName,
                Description = x.Description,
                Price = x.Price,
                StockQuantity = x.StockQuantity,
                CategoryId = x.CategoryId,
                CategoryName = x.Category.CategoryName,
                IsActive = x.IsActive,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt
            })
            .FirstOrDefaultAsync();
    }

    public async Task<ProductResponseDto?> CreateProductAsync(
        CreateProductDto request)
    {
        var categoryExists = await _context.Categories
            .AnyAsync(x =>
                x.CategoryId == request.CategoryId &&
                x.IsActive);

        if (!categoryExists)
        {
            return null;
        }

        var productName = request.ProductName.Trim();

        var duplicateExists = await _context.Products
            .AnyAsync(x =>
                x.ProductName == productName &&
                x.CategoryId == request.CategoryId);

        if (duplicateExists)
        {
            return null;
        }

        var product = new Product
        {
            ProductName = productName,
            Description = request.Description?.Trim(),
            Price = request.Price,
            StockQuantity = request.StockQuantity,
            CategoryId = request.CategoryId,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Products.Add(product);

        await _context.SaveChangesAsync();

        return await GetProductByIdAsync(product.ProductId);
    }

    public async Task<bool> UpdateProductAsync(
        int productId,
        UpdateProductDto request)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(x => x.ProductId == productId);

        if (product == null)
        {
            return false;
        }

        var categoryExists = await _context.Categories
            .AnyAsync(x =>
                x.CategoryId == request.CategoryId &&
                x.IsActive);

        if (!categoryExists)
        {
            return false;
        }

        var productName = request.ProductName.Trim();

        var duplicateExists = await _context.Products
            .AnyAsync(x =>
                x.ProductId != productId &&
                x.ProductName == productName &&
                x.CategoryId == request.CategoryId);

        if (duplicateExists)
        {
            return false;
        }

        product.ProductName = productName;
        product.Description = request.Description?.Trim();
        product.Price = request.Price;
        product.StockQuantity = request.StockQuantity;
        product.CategoryId = request.CategoryId;
        product.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeactivateProductAsync(int productId)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(x => x.ProductId == productId);

        if (product == null)
        {
            return false;
        }

        product.IsActive = false;
        product.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return true;
    }
}
package com.tom.api.controller;

import com.tom.api.dto.ProductDto;
import com.tom.api.entity.Category;
import com.tom.api.entity.Product;
import com.tom.api.service.CategoryService;
import com.tom.api.service.ProductService;
import org.apache.commons.io.FilenameUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;
    private final CategoryService categoryService;

    public ProductController(ProductService productService, CategoryService categoryService) {
        this.productService = productService;
        this.categoryService = categoryService;
    }

    @GetMapping({"/", ""})
    public ResponseEntity<List<ProductDto>> getAllProduct() {
        List<ProductDto> productDtos = productService.getAllProduct();

        return ResponseEntity.ok(productDtos);
    }

    @GetMapping("/{productId}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable("productId") Long productId) {
        ProductDto productDto = productService.getById(productId);

        if (productDto == null) {
            throw new RuntimeException("Not found!");
        }

        return ResponseEntity.ok(productDto);
    }

    @PostMapping
    public ResponseEntity<Product> addProduct(@RequestParam("name") String name,
                                                 @RequestParam("description") String description,
                                                 @RequestParam("unitPrice") String unitPrice,
                                                 @RequestParam("brand") String brand,
                                                 @RequestParam("unitsInStock") int unitsInStock,
                                                 @RequestParam("categoryName") String categoryName,
                                                 @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {
        String imageFileName = "";
        if (image != null) {
            String imageFileExt = FilenameUtils.getExtension(image.getOriginalFilename());
            if (!Arrays.asList(MimeTypeUtils.IMAGE_JPEG_VALUE,
                            MimeTypeUtils.IMAGE_PNG_VALUE,
                            MimeTypeUtils.IMAGE_GIF_VALUE).contains(image.getContentType())) {
                throw new RuntimeException(image.getOriginalFilename() + "is not an image file");
            }

            Path fileFolder = Paths.get("upload", "images/products");
            if (!Files.exists(fileFolder)) {
                Files.createDirectories(fileFolder);
            }

            imageFileName = UUID.randomUUID().toString() + "." + imageFileExt;
            Path filePath = fileFolder.resolve(imageFileName);
            Files.copy(image.getInputStream(), filePath);
        }
        Product newProduct = Product.builder()
                .name(name)
                .description(description)
                .unitPrice(new BigDecimal(unitPrice))
                .brand(brand)
                .unitsInStock(unitsInStock)
                .imageUrl(imageFileName)
                .build();

        Category category = categoryService.findByNameEntity(categoryName);

        newProduct.setCategory(category);

        productService.saveProduct(newProduct);

        return ResponseEntity.ok(newProduct);
    }
}

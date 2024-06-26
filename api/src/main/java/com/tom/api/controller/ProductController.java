package com.tom.api.controller;

import com.tom.api.dao.ProductRepository;
import com.tom.api.dao.ProductSpecification;
import com.tom.api.dto.PageInfo;
import com.tom.api.dto.ProductDto;
import com.tom.api.dto.ProductReturnDto;
import com.tom.api.entity.Category;
import com.tom.api.entity.Product;
import com.tom.api.service.CategoryService;
import com.tom.api.service.ProductService;
import org.apache.commons.io.FilenameUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

import static com.tom.api.dao.ProductSpecification.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;
    private final CategoryService categoryService;
    private final ProductRepository productRepository;
    private final ProductSpecification productSpecification;

    public ProductController(ProductService productService, CategoryService categoryService, ProductRepository productRepository, ProductSpecification productSpecification) {
        this.productService = productService;
        this.categoryService = categoryService;
        this.productRepository = productRepository;
        this.productSpecification = productSpecification;
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
        } else {
            imageFileName = "default.jpg";
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

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchProduct(@RequestParam(value = "name", defaultValue = "all") String name,
                                             @RequestParam(value = "brand", defaultValue = "all") String brand,
                                             @RequestParam(value = "category", defaultValue = "all") String category,
                                             @RequestParam(value = "pageNumber", defaultValue = "0") Integer pageNumber,
                                             @RequestParam(value = "pageSize", defaultValue = "1000") Integer pageSize,
                                             @RequestParam(value = "sort", defaultValue = "name") String sortBy) {
        Page<Product> products = productRepository.findAll(
                Specification.where(searchByName(name)
                        .and(filterByBrand(brand))
                        .and(productSpecification.filterByCategory(category))
                ),
                PageRequest.of(
                        pageNumber,
                        pageSize,
                        sortBy.equals("priceAsc")
                            ? Sort.by("unitPrice").ascending()
                            : sortBy.equals("priceDesc")
                                ? Sort.by("unitPrice").descending()
                                : Sort.by("name").ascending()
                )

        );

        List<ProductReturnDto> returnDtoList = products.stream().map(item -> new ProductReturnDto(item)).collect(Collectors.toList());

        PageInfo myPage = new PageInfo(products.getNumber(),
                                        products.getTotalElements(),
                                        products.getTotalPages(),
                                        products.getSize());

        Map<String, Object> res = new HashMap<>();
        res.put("data", returnDtoList);
        res.put("page", myPage);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }
}

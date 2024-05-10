package com.tom.api.controller;

import com.tom.api.dto.ProductDto;
import com.tom.api.service.ProductService;
import org.apache.commons.io.FilenameUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MimeType;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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

    public ProductController(ProductService productService) {
        this.productService = productService;
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
    public ResponseEntity<ProductDto> addProduct(@RequestParam("name") String name,
                                                 @RequestParam("description") String description,
                                                 @RequestParam("unitPrice") String unitPrice,
                                                 @RequestParam("brand") String brand,
                                                 @RequestParam("unitsInStock") int unitsInStock,
                                                 @RequestParam("category") String category,
                                                 @RequestParam(value = "imageUrl", required = false) MultipartFile imageUrl) throws IOException {
        imageFileName = "";
        if (imageUrl != null) {
            String imageFileExt = FilenameUtils.getExtension(imageUrl.getOriginalFilename());
            if (!Arrays.asList(MimeTypeUtils.IMAGE_JPEG_VALUE,
                            MimeTypeUtils.IMAGE_PNG_VALUE,
                            MimeTypeUtils.IMAGE_GIF_VALUE).contains(imageUrl.getContentType())) {
                throw new RuntimeException(imageUrl.getOriginalFilename() + "is not an image file");
            }

            Path path = Paths.get("upload", "images/products");

            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }

            imageFileName = UUID.randomUUID().toString() + "." + imageFileExt;

        }

    }
}

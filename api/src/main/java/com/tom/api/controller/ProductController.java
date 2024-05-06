package com.tom.api.controller;

import com.tom.api.dto.ProductDto;
import com.tom.api.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/")
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
}

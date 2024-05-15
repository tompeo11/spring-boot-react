package com.tom.api.controller;

import com.tom.api.dto.CategoryDto;
import com.tom.api.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {this.categoryService = categoryService;}

    @GetMapping({"/", ""})
    public ResponseEntity<List<CategoryDto>> getAllCategory() {
        List<CategoryDto> categoryDtos = categoryService.getAllCategory();

        return ResponseEntity.ok(categoryDtos);
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<CategoryDto> getCategoryById(@PathVariable("categoryId") Long categoryId) {
        CategoryDto categoryDto = categoryService.getById(categoryId);

        if (categoryDto == null) {
            throw new RuntimeException("Not found!");
        }

        return ResponseEntity.ok(categoryDto);
    }
}

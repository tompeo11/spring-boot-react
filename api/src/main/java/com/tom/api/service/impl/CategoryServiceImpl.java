package com.tom.api.service.impl;

import com.tom.api.dao.CategoryRepository;
import com.tom.api.dto.CategoryDto;
import com.tom.api.dto.ProductDto;
import com.tom.api.entity.Category;
import com.tom.api.entity.Product;
import com.tom.api.mapper.CategoryMapper;
import com.tom.api.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service

public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public CategoryServiceImpl(CategoryRepository categoryRepository, CategoryMapper categoryMapper) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
    }

    @Override
    public List<CategoryDto> getAllCategory() {
        List<CategoryDto> categoryDtos = categoryRepository.findAll()
                .stream()
                .map(category -> {
                    return categoryMapper.toCategoryDto(category);
                })
                .toList();

        return categoryDtos;
    }

    @Override
    public CategoryDto getById(long id) {
        Optional<Category> categoryOptional = categoryRepository.findById(id);

        if (categoryOptional.isEmpty()) {
            return null;
        }

        return categoryMapper.toCategoryDto(categoryOptional.get());
    }

    @Override
    public CategoryDto findByName(String name) {
        Category category = categoryRepository.findByName(name);

        if (category == null) {
            return null;
        }

        return categoryMapper.toCategoryDto(category);
    }

    @Override
    public Category findByNameEntity(String name) {

        return categoryRepository.findByName(name);
    }
}

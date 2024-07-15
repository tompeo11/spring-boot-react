package com.tom.api.service;

import com.tom.api.dto.CategoryDto;
import com.tom.api.entity.Category;

import java.util.List;

public interface CategoryService {
    List<CategoryDto> getAllCategory();
    CategoryDto getById(long id);
    CategoryDto findByName(String name);
    Category findByNameEntity(String name);

}

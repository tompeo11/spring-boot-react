package com.tom.api.mapper;

import com.tom.api.dto.CategoryDto;
import com.tom.api.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    @Mapping(target = "name", source = "categoryName")
    CategoryDto toCategoryDto(Category category);
    Category toCategory(CategoryDto categoryDto);
}

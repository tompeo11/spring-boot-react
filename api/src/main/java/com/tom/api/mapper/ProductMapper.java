package com.tom.api.mapper;

import com.tom.api.dto.ProductDto;
import com.tom.api.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    @Mapping(target = "categoryName", source = "category.categoryName")
    ProductDto toProductDto(Product product);
    Product toProduct(ProductDto productDto);
}

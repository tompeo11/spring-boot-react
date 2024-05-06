package com.tom.api.service;

import com.tom.api.dto.ProductDto;

import java.util.List;

public interface ProductService {
    List<ProductDto> getAllProduct();
    ProductDto getById(long id);
}

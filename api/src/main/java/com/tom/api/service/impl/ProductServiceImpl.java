package com.tom.api.service.impl;

import com.tom.api.dao.ProductRepository;
import com.tom.api.dto.ProductDto;
import com.tom.api.entity.Product;
import com.tom.api.mapper.ProductMapper;
import com.tom.api.service.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    public ProductServiceImpl(ProductRepository productRepository, ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.productMapper = productMapper;
    }

    @Override
    public List<ProductDto> getAllProduct() {
        List<ProductDto> productDtos = productRepository.findAll()
                .stream()
                .map(product -> {
                    return productMapper.toProductDto(product);
                })
                .toList();

        return productDtos;
    }

    @Override
    public ProductDto getById(long id) {
        Optional<Product> productOptional = productRepository.findById(id);

        if (productOptional.isEmpty()) {
            return null;
        }

        return productMapper.toProductDto(productOptional.get());
    }

    @Override
    public void saveProduct(Product product) {
        productRepository.save(product);
    }
}

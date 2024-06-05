package com.tom.api.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class BasketItemDto {
    private long productId;
    private String name;
    private BigDecimal unitPrice;
    private String imageUrl;
    private String brand;
    private String category;
    private int quantity;

    public BasketItemDto(long productId, String name, BigDecimal unitPrice, String imageUrl, String brand, String category, int quantity) {
        this.productId = productId;
        this.name = name;
        this.unitPrice = unitPrice;
        this.imageUrl = imageUrl;
        this.brand = brand;
        this.category = category;
        this.quantity = quantity;
    }
}

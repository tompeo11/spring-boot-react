package com.tom.api.dto;

import lombok.Data;

import java.util.List;

@Data
public class BasketDto {
    private long id;
    private String buyerId;
    private List<BasketItemDto> basketItems;
}

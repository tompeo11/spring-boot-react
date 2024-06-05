package com.tom.api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "basket")
public class Basket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "buyer_id")
    private String buyerId;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "basket")
    private Set<BasketItem> basketItems;

    public void addItem(Product product, int quantity) {
        if (product != null) {
            if (basketItems == null) {
                basketItems = new HashSet<>();
            }


            BasketItem existingItem = basketItems.stream()
                    .filter(i -> i.getProduct().getId() == product.getId())
                    .findAny()
                    .orElse(null);


            if (existingItem != null) {
                int newQuantity = existingItem.getQuantity() + quantity;
                existingItem.setQuantity(newQuantity);
            }else {
                basketItems.add(new BasketItem(product, quantity, this));
            }
        }
    }

    public Basket(String buyerId) {
        this.buyerId = buyerId;
    }
}

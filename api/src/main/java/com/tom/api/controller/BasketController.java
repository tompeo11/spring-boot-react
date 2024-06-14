package com.tom.api.controller;

import com.tom.api.dao.BasketItemRepository;
import com.tom.api.dao.BasketRepository;
import com.tom.api.dao.ProductRepository;
import com.tom.api.dto.BasketDto;
import com.tom.api.dto.BasketItemDto;
import com.tom.api.entity.Basket;
import com.tom.api.entity.BasketItem;
import com.tom.api.entity.Product;
import jakarta.persistence.NoResultException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(value = "http://localhost:3000/", allowCredentials = "true")
@RequestMapping("/api/baskets")
public class BasketController {
    private final ProductRepository productRepository;
    private final BasketRepository basketRepository;
    private final BasketItemRepository basketItemRepository;

    public BasketController(ProductRepository productRepository, BasketRepository basketRepository, BasketItemRepository basketItemRepository) {
        this.productRepository = productRepository;
        this.basketRepository = basketRepository;
        this.basketItemRepository = basketItemRepository;
    }

    @GetMapping()
    public ResponseEntity<BasketDto> getBasket(@CookieValue(name = "buyerId", defaultValue = "") String buyerId) {
        List<Basket> basketList = basketRepository.findByBuyerId(buyerId);

        if (basketList.isEmpty()) {
            throw new NoResultException("Cannot find the basket");
        }

        return getBasketDtoResponseEntity(basketList.get(0));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<BasketDto> addItemToBasket(@RequestParam("productId") Long productId,
                                                     @RequestParam("quantity") int quantity,
                                                     @CookieValue(name = "buyerId", defaultValue = "") String buyerId,
                                                     HttpServletResponse response) {
        Basket basket;

        List<Basket> basketList = basketRepository.findByBuyerId(buyerId);

        if (basketList == null || basketList.isEmpty()) {
            buyerId = UUID.randomUUID().toString();
            Cookie cookie = new Cookie("buyerId", buyerId);
            cookie.setMaxAge(30*24*60*60);
            cookie.setPath("/");
            response.addCookie(cookie);
            basket = new Basket(buyerId);
        }else {
            basket = basketList.get(0);
        }

        Product product = productRepository.findById(productId).get();
        basket.addItem(product, quantity);
        Basket returnBasket = basketRepository.save(basket);

        return getBasketDtoResponseEntity(returnBasket);
    }

//    @DeleteMapping
//    public ResponseEntity<BasketDto> removeBasketItem(@RequestParam("productId") Long productId,
//                                                      @RequestParam("quantity") int quantity,
//                                                      @CookieValue(name = "buyerId", defaultValue = "") String buyerId) {
//        List<Basket> basketList = basketRepository.findByBuyerId(buyerId);
//
//        if (basketList.isEmpty()) {
//            throw new NoResultException("Cannot find the basket");
//        }
//
//        Basket basket = basketList.get(0);
//
//        BasketItem existingItem = basket.getBasketItems().stream()
//                .filter(i -> i.getProduct().getId() == productId)
//                .findAny()
//                .orElse(null);
//
//        if(existingItem == null) {
//            throw new NoResultException("The basket doesn't have this product");
//        }
//
//        int newQuantity = existingItem.getQuantity() - quantity;
//        existingItem.setQuantity(newQuantity);
//
//        if (newQuantity <= 0) {
//            basket.getBasketItems().remove(existingItem);
//            basketItemRepository.delete(existingItem);
//        }
//
//        Basket returnBasket = basketRepository.save(basket);
//
//        return getBasketDtoResponseEntity(returnBasket);
//    }

    @DeleteMapping
    public ResponseEntity<BasketDto> removeBasketItem(@RequestParam("productId") Long productId,
                                                      @CookieValue(name = "buyerId", defaultValue = "") String buyerId) {
        List<Basket> basketList = basketRepository.findByBuyerId(buyerId);

        if (basketList.isEmpty()) {
            throw new NoResultException("Cannot find the basket");
        }

        Basket basket = basketList.get(0);

        BasketItem existingItem = basket.getBasketItems().stream()
                .filter(i -> i.getProduct().getId() == productId)
                .findAny()
                .orElse(null);

        if(existingItem == null) {
            throw new NoResultException("The basket doesn't have this product");
        }

        basket.getBasketItems().remove(existingItem);
        basketItemRepository.delete(existingItem);

        Basket returnBasket = basketRepository.save(basket);

        return getBasketDtoResponseEntity(returnBasket);
    }

    @PutMapping
    public ResponseEntity<BasketDto> updateBasketItem(@RequestParam("productId") Long productId,
                                                      @RequestParam("quantity") int quantity,
                                                      @CookieValue(name = "buyerId", defaultValue = "") String buyerId) {
        List<Basket> basketList = basketRepository.findByBuyerId(buyerId);

        if (basketList.isEmpty()) {
            throw new NoResultException("Cannot find the basket");
        }

        Basket basket = basketList.get(0);

        BasketItem existingItem = basket.getBasketItems().stream()
                .filter(i -> i.getProduct().getId() == productId)
                .findAny()
                .orElse(null);

        if(existingItem == null) {
            throw new NoResultException("The basket doesn't have this product");
        }

        existingItem.setQuantity(quantity);
        basketItemRepository.save(existingItem);

        Basket returnBasket = basketRepository.save(basket);

        return getBasketDtoResponseEntity(returnBasket);
    }

    private static ResponseEntity<BasketDto> getBasketDtoResponseEntity(Basket basketList) {
        List<BasketItemDto> basketItemDtoList = basketList.getBasketItems().stream().map(item -> new BasketItemDto(
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getProduct().getUnitPrice(),
                item.getProduct().getImageUrl(),
                item.getProduct().getBrand(),
                item.getProduct().getCategory().getCategoryName(),
                item.getQuantity()
        )).collect(Collectors.toList());

        BasketDto basketDto = new BasketDto();
        basketDto.setId(basketList.getId());
        basketDto.setBuyerId(basketList.getBuyerId());
        basketDto.setBasketItems(basketItemDtoList);

        return new ResponseEntity<>(basketDto, HttpStatus.OK);
    }
}

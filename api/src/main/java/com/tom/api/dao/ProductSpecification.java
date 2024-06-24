package com.tom.api.dao;

import com.tom.api.entity.Category;
import com.tom.api.entity.Product;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecification {
    public static Specification<Product> searchByName(String name) {
        return (root, query, criteriaBuilder) -> name.equals("all")
                ? criteriaBuilder.conjunction()
                : criteriaBuilder.like(root.get("name"), "%" + name + "%");
    }

    public static Specification<Product> filterByBrand(String brand) {
        return (root, query, criteriaBuilder) -> brand.equals("all")
                ? criteriaBuilder.conjunction()
                : criteriaBuilder.equal(root.get("brand"), brand );
    }

    public static Specification<Product> filterByCategoryId(Long categoryId) {
        return ((root, query, criteriaBuilder) -> {
            Join<Product, Category> productCategoryJoin = root.join("category");
            return categoryId == 0
                    ? criteriaBuilder.conjunction()
                    : criteriaBuilder.equal(productCategoryJoin.get("id"), categoryId);
        });
    }
}

package com.tom.api.dao;

import com.tom.api.entity.Category;
import com.tom.api.entity.Product;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ProductSpecification {
    private final CategoryRepository categoryRepository;

    public ProductSpecification(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public static Specification<Product> searchByName(String name) {
        return (root, query, criteriaBuilder) -> name.equals("all")
                ? criteriaBuilder.conjunction()
                : criteriaBuilder.like(root.get("name"), "%" + name + "%");
    }

    public static Specification<Product> filterByBrand(String inputBrandList) {
        return (root, query, criteriaBuilder) ->
        {
            if (inputBrandList.equals("all")) {
                return criteriaBuilder.conjunction();
            }else {
                List<Predicate> predicates = new ArrayList<>();
                String[] brandList = inputBrandList.split(",", -1);
                for (String brand : brandList){
                    predicates.add(criteriaBuilder.equal(root.get("brand"), brand.trim()));
                }
                return criteriaBuilder.or(predicates.toArray(new Predicate[0]));
            }
        };
    }

    public Specification<Product> filterByCategory(String categoryList) {
        return ((root, query, criteriaBuilder) -> {
            if (categoryList.equals("all")) {
                return criteriaBuilder.conjunction();
            }else {
                Join<Product, Category> productCategoryJoin = root.join("category");

                List<Predicate> predicates = new ArrayList<>();
                String[] categoryNameList = categoryList.split(",", -1);
                for (String categoryName : categoryNameList){
                    Category category = categoryRepository.findByCategoryNameIsIgnoreCase(categoryName.trim());

                    if (category != null) {
                        predicates.add(criteriaBuilder.equal(productCategoryJoin.get("id"), category.getId()));
                    }
                }
                return criteriaBuilder.or(predicates.toArray(new Predicate[0]));
            }
        });
    }
}

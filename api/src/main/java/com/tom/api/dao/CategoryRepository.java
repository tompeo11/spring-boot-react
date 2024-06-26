package com.tom.api.dao;

import com.tom.api.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    @Query("select c from Category c where c.categoryName =?1")
    Category findByName(String name);

    Category findByCategoryNameIsIgnoreCase(String categoryName);
}

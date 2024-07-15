package com.tom.api.dao;

import com.tom.api.entity.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthorityRepository extends JpaRepository<User, Long> {

}

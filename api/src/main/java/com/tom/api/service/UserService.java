package com.tom.api.service;

import com.tom.api.entity.domain.User;
import com.tom.api.exception.CustomRuntimeException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface UserService {
    User addNewUser(User user, String[] role, MultipartFile profileImage) throws IOException;
    User updateUser(User user, String[] role, MultipartFile profileImage) throws IOException;
    void resetPassword(String email) throws CustomRuntimeException;
    void deleteUser(long id) throws CustomRuntimeException, IOException;
}

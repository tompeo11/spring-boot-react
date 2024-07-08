package com.tom.api.service;

import com.tom.api.dto.UserDto;

import java.io.IOException;
import java.util.List;

public interface UserService {
    List<UserDto> getAllUser();
    UserDto getUserById(long id);
    UserDto addUser(UserDto user) throws IOException;

    UserDto updateUser(long id, UserDto userDto) throws IOException;

    void deleteUser(long id) throws IOException;
}

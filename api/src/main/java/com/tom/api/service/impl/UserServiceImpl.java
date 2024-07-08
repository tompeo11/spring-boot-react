package com.tom.api.service.impl;

import com.tom.api.dao.RoleRepository;
import com.tom.api.dao.UserRepository;
import com.tom.api.dto.UserDto;
import com.tom.api.entity.Role;
import com.tom.api.entity.User;
import com.tom.api.mapper.UserMapper;
import com.tom.api.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public List<UserDto> getAllUser() {
        return userRepository
                .findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public UserDto getUserById(long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found!"));
        return this.toDto(user);
    }

    @Override
    public UserDto addUser(UserDto userDto) throws IOException {
        User user = this.toEntity(userDto);

        user.setActive(userDto.getStringIsActive().equals("true"));
        user.setLock(userDto.getStringIsLock().equals("true"));

        List<Role> roles = getRoleList(userDto.getRoles());
        user.setRoles(roles);

        MultipartFile image = userDto.getImage();

        if (image != null) {
            String avatarUrl = addImage(image);
            user.setAvatarUrl(avatarUrl);
        } else {
            user.setAvatarUrl("default.png");
        }

        userRepository.save(user);
        return this.toDto(user);
    }

    @Override
    public UserDto updateUser(long id, UserDto userDto) throws IOException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(userDto.getFirstName());

        user.setLastName(userDto.getLastName());

        user.setUserName(userDto.getUserName());

        user.setEmail(userDto.getEmail());

        user.setPassword(userDto.getPassword());

        user.setActive(userDto.getStringIsActive().equals("true"));

        user.setLock(userDto.getStringIsLock().equals("true"));

        List<Role> roles = getRoleList(userDto.getRoles());
        user.setRoles(roles);

        if (userDto.getImage() != null) {
            deleteImage(user.getAvatarUrl());
            String avatarUrl = addImage(userDto.getImage());
            user.setAvatarUrl(avatarUrl);
        }

        userRepository.save(user);
        return this.toDto(user);
    }

    @Override
    public void deleteUser(long id) throws IOException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.getRoles().clear();

        deleteImage(user.getAvatarUrl());

        userRepository.delete(user);
    }

    private UserDto toDto(User user) {
        String roles = user.getRoles()
                .stream()
                .map(Role::getName)
                .collect(Collectors.joining(", "));


        return UserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .userName(user.getUserName())
                .email(user.getEmail())
                .password(user.getPassword())
                .isActive(user.isActive())
                .isLock(user.isLock())
                .avatarUrl(user.getAvatarUrl())
                .roles(roles)
                .build();
    }

    private User toEntity(UserDto userDto) {
        return User.builder()
                .id(userDto.getId())
                .firstName(userDto.getFirstName())
                .lastName(userDto.getLastName())
                .userName(userDto.getUserName())
                .email(userDto.getEmail())
                .password(userDto.getPassword())
                .isActive(userDto.isActive())
                .isLock(userDto.isLock())
                .avatarUrl(userDto.getAvatarUrl())
                .build();
    }

    private String addImage(MultipartFile image) throws IOException {
        String imageFileExtension = image.getContentType();

        List<String> allowedExtensions = Arrays.asList(MimeTypeUtils.IMAGE_JPEG_VALUE, MimeTypeUtils.IMAGE_PNG_VALUE);
        if (!allowedExtensions.contains(imageFileExtension)) {
            throw new RuntimeException("Only PNG and JPEG images are allowed");
        }

        Path fileFolder = Path.of("upload/images/profile");

        if (!Files.exists(fileFolder)) {
            Files.createDirectories(fileFolder);
        }

        String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
        Path filePath = fileFolder.resolve(fileName);
        Files.copy(image.getInputStream(), filePath);

        return fileName;
    }


    private List<Role> getRoleList(String roles) {
        List<Long> roleIds;
        try {
            roleIds = Stream.of(roles.split(","))
                    .map(String::trim)
                    .map(Long::parseLong)
                    .toList();
        } catch (Exception e) {
            throw new RuntimeException("Roles are invalid");
        }

        if (roleIds.isEmpty()) {
            throw new RuntimeException("Roles are invalid");
        }

        return roleRepository.findAllById(roleIds);
    }

    private void deleteImage(String fileName) throws IOException {
        if (fileName.equals("default.jpg")) {
            return;
        }

        Path path = Path.of("upload/images/profile/" + fileName);
        Files.deleteIfExists(path);
    }
}

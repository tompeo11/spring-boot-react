package com.tom.api.controller;

import com.tom.api.dto.UserDto;
import com.tom.api.service.EmailService;
import com.tom.api.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final EmailService emailService;

    public UserController(UserService userService, EmailService emailService) {
        this.userService = userService;
        this.emailService = emailService;
    }

    @GetMapping({"/", ""})
    public ResponseEntity<List<UserDto>> getAllUser() {
        return ResponseEntity.ok(userService.getAllUser());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getUserById(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @PostMapping({"/", ""})
    public ResponseEntity<UserDto> addUser(@Valid @ModelAttribute UserDto userDto) throws IOException {
        UserDto user = userService.addUser(userDto);

        if (user != null) {
            String template = """
                    Tai khoan cua ban vua duoc tao thanh cong:
                    Username: %s
                    Password: %s
                    """;

            String context = String.format(template, user.getUserName(), user.getPassword(), user.getEmail());
            emailService.sendSimpleMessage(user.getEmail(), "Chao mung", context);
        }

        return ResponseEntity.ok(user);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserDto> updateUser(@PathVariable("userId") Long userId,
                                              @Valid @ModelAttribute UserDto userDto) throws IOException {

        emailService.sendSimpleMessage(userDto.getEmail(), "Thong tin tai khoan", "Mat khau moi: " + userDto.getPassword());

        return ResponseEntity.ok(userService.updateUser(userId, userDto));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable("userId") Long userId) throws IOException {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}

package com.tom.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private long id;

    @NotEmpty(message = "First name is required")
    private String firstName;

    @NotEmpty(message = "Last name is required")
    private String lastName;

    @NotEmpty(message = "Username is required")
    private String userName;

    @NotEmpty(message = "Email is required")
    @Email(message = "Email is invalid")
    private String email;

    @NotEmpty(message = "Password is required")
    private String password;

    private String avatarUrl = "default.jpg";

    @JsonProperty(value = "isActive")
    private boolean isActive;

    @JsonProperty(value = "isLock")
    private boolean isLock;

    @NotEmpty(message = "Roles are required")
    private String roles;

    @Transient
    @JsonIgnore
    @NotEmpty(message = "Active status are required")
    private String stringIsActive;

    @Transient
    @JsonIgnore
    @NotEmpty(message = "Lock status are required")
    private String stringIsLock;

    @Transient
    @JsonIgnore
    private MultipartFile image;
}

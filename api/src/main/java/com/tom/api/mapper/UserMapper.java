package com.tom.api.mapper;

import com.tom.api.dto.UserDto;
import com.tom.api.entity.Role;
import com.tom.api.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "roles", source = "roles", qualifiedByName = "mapRolesDto")
    UserDto toUserDto(User user);

    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "isActive", source = "active")
    @Mapping(target = "isLock", source = "lock")
    User toUser(UserDto userDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roles", ignore = true)
    void updateFromDto(UserDto userDTO, @MappingTarget User user);

    @Named("mapRolesDto")
    default String map(List<Role> roles) {
        return roles.stream()
                .map(Role::getName)
                .collect(Collectors.joining(", "));
    }
}

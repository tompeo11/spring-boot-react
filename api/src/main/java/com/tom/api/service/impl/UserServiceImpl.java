package com.tom.api.service.impl;

import com.tom.api.constant.FileConstant;
import com.tom.api.dao.RoleRepository;
import com.tom.api.dao.UserRepository;
import com.tom.api.entity.domain.User;
import com.tom.api.entity.domain.UserPrincipal;
import com.tom.api.exception.CustomRuntimeException;
import com.tom.api.service.EmailService;
import com.tom.api.service.UserService;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Date;
import java.util.stream.Collectors;

import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

@Service
@Transactional
@Qualifier("myUserDetailsService")
public class UserServiceImpl implements UserService, UserDetailsService {
    private Logger LOGGER = LoggerFactory.getLogger(UserServiceImpl.class);
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final EmailService emailService;

    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.emailService = emailService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findUserByUsername(username);

        if (user == null) {
            LOGGER.error("User not found by username: " + username);
            throw new RuntimeException("User not found by username: " + username);
        }else {
            user.setLastLoginDateDisplay(user.getLastLoginDate());
            user.setLastLoginDate(new Date());
            userRepository.save(user);

            UserPrincipal userPrincipal = new UserPrincipal(user);
            return userPrincipal;
        }
    }

    @Override
    public User addNewUser(User user, String[] role, MultipartFile profileImage) throws IOException {
        String password = RandomStringUtils.randomAlphabetic(10);

        user.setUserId(RandomStringUtils.randomNumeric(12));
        user.setJoinDate(new Date());
        user.setPassword(password);
        user.setRoles(Arrays.stream(role).map(roleRepository::findRoleByName).collect(Collectors.toSet()));
        user.setAuthorities(Arrays.stream(role).map(roleRepository::findRoleByName)
                .flatMap(ro -> ro.getAuthorities().stream()).collect(Collectors.toSet()));
        user.setProfileImageUrl(ServletUriComponentsBuilder.fromCurrentContextPath()
                .path(FileConstant.DEFAULT_USER_IMAGE_PATH + user.getUsername()).toUriString());

        userRepository.save(user);

        saveProfileImage(user, profileImage);

        LOGGER.info("Random password: " + password);

        return user;
    }

    @Override
    public User updateUser(User user, String[] role, MultipartFile profileImage) throws IOException {
        user.setRoles(Arrays.stream(role).map(roleRepository::findRoleByName).collect(Collectors.toSet()));
        user.setAuthorities(Arrays.stream(role).map(roleRepository::findRoleByName)
                .flatMap(ro -> ro.getAuthorities().stream()).collect(Collectors.toSet()));

        userRepository.save(user);
        saveProfileImage(user, profileImage);

        return user;
    }

    @Override
    public void resetPassword(String email) throws CustomRuntimeException {
        User user = userRepository.findUserByEmail(email);

        if (user == null) {
            throw new CustomRuntimeException("No user found for the email: " + email);
        }

        String password = RandomStringUtils.randomAlphabetic(10);
        user.setPassword(password);
        userRepository.save(user);
        LOGGER.info("Reset password: " + password);
        emailService.sendSimpleMessage(
                user.getEmail(),
                "Your new password",
                "Hello " + user.getFirstName() + "\n\nYour new password is " + password + "\n\nThe support team");
    }

    @Override
    public void deleteUser(long id) throws CustomRuntimeException, IOException {
        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            throw new CustomRuntimeException("User not found");
        }

        Path userFolder = Paths.get(FileConstant.USER_FOLDER + user.getUsername());
        FileUtils.deleteDirectory(new File(userFolder.toString()));

        userRepository.deleteById(id);
    }

    private void saveProfileImage(User user, MultipartFile profileImage) throws IOException {
        if (profileImage != null) {
            Path userFolder = Paths.get(FileConstant.USER_FOLDER + user.getUsername()).toAbsolutePath().normalize();

            if (!Files.exists(userFolder)) {
                Files.createDirectories(userFolder);
            }

            Files.deleteIfExists(Paths.get(userFolder + user.getUsername() + ".jpg"));
            Files.copy(profileImage.getInputStream(), userFolder.resolve(user.getUsername() + ".jpg"), REPLACE_EXISTING);

            user.setProfileImageUrl(ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path(FileConstant.USER_IMAGE_PATH + user.getUsername() + File.separator
                    + user.getUsername() + ".jpg").toUriString());

            userRepository.save(user);

            LOGGER.info("Save file in file system by name: " + profileImage.getOriginalFilename());
        }
    }

}

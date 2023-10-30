package com.codechallenge.useradministration.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User updateUser(Long id, User user) {
        if(userRepository.existsById(id)) {
            User currentUser = userRepository.findById(id).orElse(null);
            if (currentUser != null) {
                if (!user.getPassword().equals(currentUser.getPassword())) {
                    user.setPassword(passwordEncoder.encode(user.getPassword()));
                }

                user.setId(id);
                return userRepository.save(user);
            }
        }
        return null;
    }

    public void deleteUser(Long id) {
        if(userRepository.existsById(id)) {
            userRepository.deleteById(id);
        }
    }
}

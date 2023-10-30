package com.codechallenge.useradministration.authentication;

import com.codechallenge.useradministration.user.User;
import com.codechallenge.useradministration.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthenticationController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthenticationController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody User user) {

        Optional<User> existingUserByEmail = userRepository.findByEmail(user.getEmail());
        Optional<User> existingUserByLogin = userRepository.findByLogin(user.getLogin());

        if (existingUserByEmail.isPresent() || existingUserByLogin.isPresent()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "Email or login already in use"));
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(User.Role.ROLE_User);
        userRepository.save(user);

        return ResponseEntity.ok(Collections.singletonMap("message", "Registration successful."));
    }

    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> checkAuthentication(Authentication authentication) {
        boolean isAuthenticated = (authentication != null && authentication.isAuthenticated());

        Map<String, Object> response = new HashMap<>();
        response.put("isAuthenticated", isAuthenticated);

        if(isAuthenticated) {
            authentication.getAuthorities().stream().findFirst().ifPresent(authority -> response.put("role", authority.getAuthority()));

            String username = authentication.getName();
            Optional<User> optionalUser = userRepository.findByLogin(username);
            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                response.put("userId", user.getId());
            }
        }
        return ResponseEntity.ok(response);
    }


}

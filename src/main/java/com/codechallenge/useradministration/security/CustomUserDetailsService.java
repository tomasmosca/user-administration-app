package com.codechallenge.useradministration.security;

import com.codechallenge.useradministration.user.User;
import com.codechallenge.useradministration.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try {
            User user = userRepository.findByLogin(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

            return new org.springframework.security.core.userdetails.User(
                    user.getLogin(),
                    user.getPassword(),
                    AuthorityUtils.createAuthorityList(user.getRole().toString())
            );
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

}


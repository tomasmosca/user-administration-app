package com.codechallenge.useradministration.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collection;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    private final CustomUserDetailsService userDetailsService;

    @Autowired
    public SecurityConfiguration(CustomUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors().and()
                .csrf().disable()
                .authorizeRequests()
                .antMatchers("/login", "/api/v1/auth/**").permitAll()
                .antMatchers(HttpMethod.POST, "/api/v1/users").hasRole("Admin")
                .antMatchers(HttpMethod.GET, "/api/v1/users").permitAll()
                .antMatchers(HttpMethod.GET, "/api/v1/users/**").hasAnyRole("Admin", "User")
                .antMatchers(HttpMethod.PUT, "/api/v1/users/**").hasAnyRole("Admin", "User")
                .antMatchers(HttpMethod.DELETE, "/api/v1/users/**").hasRole("Admin")
                .anyRequest().authenticated()
                .and()
                .formLogin()
                .usernameParameter("username")
                .successHandler(new AuthenticationSuccessHandler() {
                    @Override
                    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                                        Authentication authentication) throws IOException, ServletException {

                        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
                        String userRole = authorities.stream()
                                .map(GrantedAuthority::getAuthority)
                                .findFirst()
                                .orElse("ROLE_Viewer");

                        response.setStatus(HttpServletResponse.SC_OK);
                        response.getWriter().write(String.format("{\"message\":\"Login successful\", \"role\":\"%s\"}", userRole));
                    }
                })
                .permitAll()
                .and()
                .logout()
                .logoutSuccessHandler(new LogoutSuccessHandler() {
                    @Override
                    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
                        response.setStatus(HttpServletResponse.SC_OK);
                        response.setContentType("application/json");
                        response.getWriter().write("{\"message\":\"Logged out successfully\"}");
                    }
                })
                .permitAll();
        return http.build();
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/v1/**").allowedOrigins("http://localhost:4200").allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS").allowCredentials(true);
                registry.addMapping("/login").allowedOrigins("http://localhost:4200").allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS").allowCredentials(true);
                registry.addMapping("/logout").allowedOrigins("http://localhost:4200").allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS").allowCredentials(true);
            }
        };
    }

    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}




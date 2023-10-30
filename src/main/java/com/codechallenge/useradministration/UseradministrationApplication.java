package com.codechallenge.useradministration;

import com.codechallenge.useradministration.user.User;
import com.codechallenge.useradministration.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@SpringBootApplication
public class UseradministrationApplication {

	public static void main(String[] args) {

		SpringApplication.run(UseradministrationApplication.class, args);
	}

	@Bean
	CommandLineRunner initDatabase(UserRepository repository, PasswordEncoder passwordEncoder) {
		return args -> {
			String defaultAdminLogin = "admin";
			Optional<User> adminUser = repository.findByLogin(defaultAdminLogin);
			if (adminUser.isEmpty()) {
				User newUser = new User();
				newUser.setIdentification("admin123");
				newUser.setName("Admin User");
				newUser.setAge(30);
				newUser.setPhone("123456789");
				newUser.setAddress("123 Admin Street");
				newUser.setEmail("admin@example.com");
				newUser.setLogin(defaultAdminLogin);
				newUser.setPassword(passwordEncoder.encode("password"));
				newUser.setRole(User.Role.ROLE_Admin);

				repository.save(newUser);
				System.out.println("Default admin user created");
			}
		};
	}

}

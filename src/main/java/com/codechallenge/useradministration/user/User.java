package com.codechallenge.useradministration.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    @SequenceGenerator(
            name = "user_sequence",
            sequenceName = "user_sequence",
            allocationSize = 1
    )
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_sequence")
    private Long id;

    @Column(unique=true)
    private String identification;

    private String name;

    @Min(value = 0, message = "Age cannot be negative")
    @Max(value = 150, message = "Age cannot be more than 150")
    private int age;

    private String phone;

    private String address;

    @Column(nullable=false, unique=true)
    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Invalid email format")
    private String email;

    @Column(nullable=false, unique=true)
    @NotBlank(message = "Login cannot be blank")
    private String login;

    @Column(nullable=false)
    @NotBlank(message = "Password cannot be blank")
    private String password;

    @Column(nullable=false)
    @Enumerated(EnumType.STRING)
    private Role role;

    public enum Role {
        ROLE_Admin, ROLE_Viewer, ROLE_User
    }

}
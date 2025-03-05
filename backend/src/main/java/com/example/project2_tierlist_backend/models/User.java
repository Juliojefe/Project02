package com.example.project2_tierlist_backend.models;

import jakarta.persistence.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Entity
@Table(name = "User")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "userId")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "userPassword", nullable = false)
    private String password;

    @Column(name = "isAdmin")
    private Boolean isAdmin = false;

    @Column(name = "image")
    private String image;

    public User() {}

    public User(String name, String email, String password) {
        this.name = name;
        this.email = email;
        setPassword(password); // Hash password before storing
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public Boolean getIsAdmin() { return isAdmin; }
    public String getImage() { return image; }

    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setIsAdmin(Boolean isAdmin) { this.isAdmin = isAdmin; }
    public void setImage(String image) { this.image = image; }

    public void setPassword(String password) {
        this.password = password; // Store plaintext
    }
}

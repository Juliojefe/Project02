package com.example.project2_tierlist_backend.controllers;

import com.example.project2_tierlist_backend.models.User;
import com.example.project2_tierlist_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // User Registration with Hashed Password
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("⚠️ Email already exists!");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword())); // ✅ Hash the password before saving
        userRepository.save(user);
        return ResponseEntity.ok("✅ User registered successfully!");
    }

    // User Login
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody User userDetails) {
        Optional<User> user = userRepository.findByEmail(userDetails.getEmail());

        if (user.isPresent()) {
            String storedHashedPassword = user.get().getPassword();
            String enteredPassword = userDetails.getPassword(); // Should be plain text, not hashed

            System.out.println("🔍 Stored Hashed Password: " + storedHashedPassword);
            System.out.println("🔍 Entered Raw Password: " + enteredPassword);

            // Compare raw password with stored hashed password
            if (passwordEncoder.matches(enteredPassword, storedHashedPassword)) {
                return ResponseEntity.ok("✅ Login successful!");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Invalid email or password.");
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Invalid email or password.");
    }

    // Get All Users
    @GetMapping("/")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get User by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update User (Only name and image can be updated)
    @PutMapping("/{id}")
    public ResponseEntity<String> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        return userRepository.findById(id).map(user -> {
            user.setName(userDetails.getName());
            user.setImage(userDetails.getImage());
            userRepository.save(user);
            return ResponseEntity.ok("✅ User updated successfully!");
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete User
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.ok("✅ User deleted successfully!");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

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
@CrossOrigin(origins = "http://localhost:8081")
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

        System.out.println("🔍 [REGISTER] Raw Password: " + user.getPassword());

        user.setPassword(user.getPassword()); // Store as plaintext (INSECURE)
        userRepository.save(user);
        return ResponseEntity.ok("✅ User registered successfully!");
    }

    // User Login
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody User userDetails) {
        Optional<User> user = userRepository.findByEmail(userDetails.getEmail());

        if (user.isPresent()) {
            String storedPassword = user.get().getPassword();
            String enteredPassword = userDetails.getPassword();

            System.out.println("🔍 [LOGIN] Stored Password: " + storedPassword);
            System.out.println("🔍 [LOGIN] Entered Password: " + enteredPassword);

            // Simple string comparison (INSECURE)
            if (enteredPassword.equals(storedPassword)) {
                return ResponseEntity.ok("✅ Login successful!");
            } else {
                System.out.println("❌ [LOGIN] Password Mismatch");
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

    // Get User's ID by email
    @GetMapping("/userIDLogin")
    public ResponseEntity<Object> getIdByEmail(@RequestParam("email") String email) {
        Optional<User> user = userRepository.findByEmail(email);

        // second check to make sure user exists
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get().getId());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ User doesn't exist.");
        }
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